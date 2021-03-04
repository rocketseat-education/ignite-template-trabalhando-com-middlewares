const { v4 } = require('uuid');

const {
  users,
  checksTodoExists
} = require('../../');

let response;
let request;
let mockNext;

describe('checksTodoExists', () => {
  beforeEach(() => {
    users.splice(0, users.length);

    request = (params) => {
      return {
        ...params
      }
    };

    response = () => {
      const response = {}

      response.status = jest.fn((code) => {
        return {
          ...response,
          statusCode: code
        }
      });

      response.json = jest.fn((obj) => {
        return {
          ...response,
          body: obj
        }
      });

      return response;
    };

    mockNext = jest.fn();
  });

  it('should be able to put user and todo in request when both exits', () => {
    const todo = {
      id: v4(),
      title: 'bip bip',
      deadline: new Date(),
      done: false,
      created_at: new Date()
    }

    users.push({
      id: v4(),
      name: 'Atlas',
      username: 'atlas',
      pro: false,
      todos: [todo]
    });

    const mockRequest = request({
      headers: { username: 'atlas' },
      params: { id: todo.id }
    });

    const mockTodoSetter = jest.fn((todoData) => { this.todo = todoData });
    const mockUserSetter = jest.fn((userData) => { this.user = userData });

    mockRequest.__defineSetter__('todo', mockTodoSetter);
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    checksTodoExists(mockRequest, mockResponse, mockNext);

    expect(mockTodoSetter).toBeCalledWith(
      expect.objectContaining({
        ...todo,
      })
    );
    expect(mockUserSetter).toBeCalledWith(
      expect.objectContaining({
        name: 'Atlas',
        username: 'atlas',
      })
    );
    expect(mockNext).toBeCalled();
  });

  it('should not be able to put user and todo in request when user does not exists', () => {
    const todo = {
      id: v4(),
      title: 'bip bip',
      deadline: new Date(),
      done: false,
      created_at: new Date()
    }

    const mockRequest = request({
      headers: { username: 'atlas' },
      params: { id: todo.id }
    });

    const mockTodoSetter = jest.fn((todoData) => { this.todo = todoData });
    const mockUserSetter = jest.fn((userData) => { this.user = userData });

    mockRequest.__defineSetter__('todo', mockTodoSetter);
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    checksTodoExists(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toBeCalledWith(404);

    expect(mockTodoSetter).not.toBeCalled();
    expect(mockUserSetter).not.toBeCalled();

    expect(mockNext).not.toBeCalled();
  });

  it('should not be able to put user and todo in request when todo id is not uuid', () => {
    users.push({
      id: v4(),
      name: 'Atlas',
      username: 'atlas',
      pro: false,
      todos: []
    });

    const mockRequest = request({
      headers: { username: 'atlas' },
      params: { id: 'invalid-id' }
    });

    const mockTodoSetter = jest.fn((todoData) => { this.todo = todoData });
    const mockUserSetter = jest.fn((userData) => { this.user = userData });

    mockRequest.__defineSetter__('todo', mockTodoSetter);
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    checksTodoExists(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toBeCalledWith(400);

    expect(mockTodoSetter).not.toBeCalled();
    expect(mockUserSetter).not.toBeCalled();

    expect(mockNext).not.toBeCalled();
  });

  it('should not be able to put user and todo in request when todo does not exists', () => {
    users.push({
      id: v4(),
      name: 'Atlas',
      username: 'atlas',
      pro: false,
      todos: []
    });

    const mockRequest = request({
      headers: { username: 'atlas' },
      params: { id: v4() }
    });

    const mockTodoSetter = jest.fn((todoData) => { this.todo = todoData });
    const mockUserSetter = jest.fn((userData) => { this.user = userData });

    mockRequest.__defineSetter__('todo', mockTodoSetter);
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    checksTodoExists(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toBeCalledWith(404);

    expect(mockTodoSetter).not.toBeCalled();
    expect(mockUserSetter).not.toBeCalled();

    expect(mockNext).not.toBeCalled();
  });
})