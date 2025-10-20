import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
import {
  GameConfig,
  GameConfigCalculated,
  GameConfigSettings,
  GameType,
  DEFAULT_GAME_CONFIG_SETTINGS
} from '@/domain/models';
import type { Json } from '@/lib/database.types';

/**
 * Hook para gerenciar configurações do jogo
 * Busca configuração ativa do Supabase e calcula valores automaticamente
 */
export const useGameConfig = (gameType: GameType = 'solo_game') => {
  const {
    data: rawConfig,
    error,
    isLoading,
    mutate
  } = useSWR(
    `game-config-${gameType}`,
    async () => {
      const { data, error } = await supabase
        .from('game_configs')
        .select('*')
        .eq('game_type', gameType)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  // Converter dados do database para tipos do domínio
  const config: GameConfig | null = rawConfig ? {
    id: rawConfig.id,
    game_type: rawConfig.game_type as GameType,
    config_name: rawConfig.config_name,
    settings: rawConfig.settings as unknown as GameConfigSettings,
    is_active: rawConfig.is_active,
    created_by: rawConfig.created_by,
    created_at: rawConfig.created_at,
    updated_at: rawConfig.updated_at,
  } : null;

  // Cálculos automáticos baseados na configuração
  const calculatedConfig: GameConfigCalculated | null = config ? {
    config,
    pointsPerQuestion: 10 / config.settings.questionCount,
    penaltyPerError: config.settings.penaltyEnabled
      ? (10 / config.settings.questionCount) * 0.25
      : 0,
    totalPossiblePoints: 10,
  } : null;

  // Fallback para configurações padrão se não houver configuração ativa
  const effectiveConfig: GameConfigCalculated = calculatedConfig || {
    config: {
      id: 'default',
      game_type: gameType,
      config_name: 'Configuração Padrão',
      settings: DEFAULT_GAME_CONFIG_SETTINGS,
      is_active: true,
      created_by: null,
      created_at: null,
      updated_at: null,
    },
    pointsPerQuestion: 10 / DEFAULT_GAME_CONFIG_SETTINGS.questionCount,
    penaltyPerError: DEFAULT_GAME_CONFIG_SETTINGS.penaltyEnabled
      ? (10 / DEFAULT_GAME_CONFIG_SETTINGS.questionCount) * 0.25
      : 0,
    totalPossiblePoints: 10,
  };

  return {
    config: effectiveConfig,
    rawConfig,
    isLoading,
    error,
    mutate,
    // Helpers
    hasCustomConfig: !!config,
    isUsingDefaults: !config,
  };
};

/**
 * Hook para salvar uma nova configuração
 */
export const useSaveGameConfig = () => {
  const saveConfig = async (
    gameType: GameType,
    configName: string,
    settings: GameConfigSettings
  ): Promise<GameConfig> => {
    // Primeiro, desativa todas as configurações ativas do mesmo tipo
    await supabase
      .from('game_configs')
      .update({ is_active: false })
      .eq('game_type', gameType)
      .eq('is_active', true);

    // Depois, cria a nova configuração ativa
    const { data, error } = await supabase
      .from('game_configs')
      .insert({
        game_type: gameType,
        config_name: configName,
        settings: settings as unknown as Json, // Cast necessário para compatibilidade com Json
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Converter dados do database para tipos do domínio
    return {
      id: data.id,
      game_type: data.game_type as GameType,
      config_name: data.config_name,
      settings: data.settings as unknown as GameConfigSettings,
      is_active: data.is_active,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  return { saveConfig };
};

/**
 * Hook para obter todas as configurações (para admin)
 */
export const useGameConfigs = (gameType?: GameType) => {
  const queryKey = gameType ? `game-configs-${gameType}` : 'game-configs-all';

  const {
    data: rawConfigs,
    error,
    isLoading,
    mutate
  } = useSWR(
    queryKey,
    async () => {
      let query = supabase
        .from('game_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (gameType) {
        query = query.eq('game_type', gameType);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    }
  );

  // Converter dados do database para tipos do domínio
  const configs: GameConfig[] = (rawConfigs || []).map(rawConfig => ({
    id: rawConfig.id,
    game_type: rawConfig.game_type as GameType,
    config_name: rawConfig.config_name,
    settings: rawConfig.settings as unknown as GameConfigSettings,
    is_active: rawConfig.is_active,
    created_by: rawConfig.created_by,
    created_at: rawConfig.created_at,
    updated_at: rawConfig.updated_at,
  }));

  return {
    configs: configs || [],
    isLoading,
    error,
    mutate,
  };
};