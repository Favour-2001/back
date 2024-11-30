// Add this at the top of your test file
beforeAll(() => {
    global.alert = jest.fn(); // Mock the alert function
  });

  
// Mocking the fetch function to avoid real API calls
global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
      ok: true
    })
  );
  
  describe('Task Creation', () => {
    let taskForm, titleInput, descriptionInput, deadlineInput, priorityInput;
  
    beforeEach(() => {
      // Setup DOM elements for the test
      document.body.innerHTML = `
        <form id="task-form">
          <input type="text" id="title" placeholder="Task Title" required>
          <textarea id="description" placeholder="Task Description"></textarea>
          <input type="date" id="deadline" required>
          <select id="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      `;
      
      taskForm = document.getElementById('task-form');
      titleInput = document.getElementById('title');
      descriptionInput = document.getElementById('description');
      deadlineInput = document.getElementById('deadline');
      priorityInput = document.getElementById('priority');
  
      // Simulate the task creation form submission
      taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value;
        const description = descriptionInput.value;
        const deadline = deadlineInput.value;
        const priority = priorityInput.value;
  
        const response = await fetch('http://localhost:5001/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, deadline, priority })
        });
  
        const data = await response.json();
        
        if (response.ok) {
          alert("Task added successfully");
        } else {
          alert(data.message || "Error occurred while adding task");
        }
      });
    });
  
    test('creates a task successfully when form is submitted', async () => {
      // Fill in form data
      titleInput.value = "Test Task";
      descriptionInput.value = "Test description";
      deadlineInput.value = "2024-12-31";
      priorityInput.value = "high";
  
      // Trigger form submission
      taskForm.dispatchEvent(new Event('submit'));
  
      // Wait for fetch to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
  
      // Check that the fetch function was called
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/tasks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: "Test Task",
            description: "Test description",
            deadline: "2024-12-31",
            priority: "high"
          })
        })
      );
    });
  });
  

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original implementations after tests
  });