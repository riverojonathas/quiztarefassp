async function testAdminAccess() {
  try {
    console.log('Testing admin page access...');

    // Testar acesso sem autenticação
    const response = await fetch('http://localhost:3000/admin/questions');
    const finalUrl = response.url;
    const status = response.status;

    console.log(`Status: ${status}`);
    console.log(`Final URL: ${finalUrl}`);

    if (status === 307 || finalUrl.includes('/home') || finalUrl.includes('/signin')) {
      console.log('✅ Admin access correctly blocked - redirecting to home/signin');
    } else if (status === 200 && finalUrl.includes('/admin/questions')) {
      console.log('❌ Admin access incorrectly allowed without authentication');
    } else {
      console.log(`❓ Unexpected response: ${status} -> ${finalUrl}`);
    }

  } catch (error) {
    console.error('Error testing admin access:', error.message);
  }
}

testAdminAccess();