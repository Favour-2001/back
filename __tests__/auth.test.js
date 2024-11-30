// Add this at the top of your test file
beforeAll(() => {
    global.alert = jest.fn(); // Mock the alert function
  });

global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ token: 'test-token' }),
      ok: true
    })
  );
  
  describe('User Authentication', () => {
    let authForm, emailInput, passwordInput;
  
    beforeEach(() => {
      // Setup DOM elements for the test
      document.body.innerHTML = `
        <form id="authForm">
          <input type="email" id="email" placeholder="Enter your email" required>
          <input type="password" id="password" placeholder="Enter your password" required>
          <button type="submit">Login</button>
        </form>
      `;
      
      authForm = document.getElementById('authForm');
      emailInput = document.getElementById('email');
      passwordInput = document.getElementById('password');
  
      // Simulate the login form submission
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
  
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('token', data.token); // Storing the token
          alert('Login successful!');
        } else {
          alert(data.message || 'Error occurred during login');
        }
      });
    });
  
    test('logs in successfully when correct credentials are provided', async () => {
      // Fill in form data
      emailInput.value = "testuser@example.com";
      passwordInput.value = "password123";
  
      // Trigger form submission
      authForm.dispatchEvent(new Event('submit'));
  
      // Wait for fetch to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
  
      // Check that fetch was called with correct login data
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: "testuser@example.com",
            password: "password123"
          })
        })
      );
      
      // Verify token was saved to localStorage
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  
    test('fails login if incorrect credentials are provided', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ message: 'Invalid credentials' }),
          ok: false
        })
      );
  
      emailInput.value = "wronguser@example.com";
      passwordInput.value = "wrongpassword";
  
      // Trigger form submission
      authForm.dispatchEvent(new Event('submit'));
  
      // Wait for fetch to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
  
      // Verify that an error alert is triggered
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });
  
  afterAll(() => {
    jest.restoreAllMocks(); // Restore original implementations after tests
  });