from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import pandas as pd
from passlib.context import CryptContext
import jwt
import datetime
from typing import List, Optional

app = FastAPI()

# Файлы базы данных
USERS_FILE = "users.xlsx"
TODOS_FILE = "todos.xlsx"

# Настройки безопасности
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Загрузка пользователей
try:
    users_df = pd.read_excel(USERS_FILE)
    users = users_df.to_dict(orient="records")
except FileNotFoundError:
    users = []
    pd.DataFrame(users).to_excel(USERS_FILE, index=False)

# Загрузка задач
try:
    todos_df = pd.read_excel(TODOS_FILE)
    todos = todos_df.to_dict(orient="records")
except FileNotFoundError:
    todos = []
    pd.DataFrame(todos).to_excel(TODOS_FILE, index=False)

# Модели
class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ToDoItem(BaseModel):
    title: str
    description: Optional[str] = None
    done: bool = False  # Добавлено поле "выполнено"

# Функции
def save_users():
    pd.DataFrame(users).to_excel(USERS_FILE, index=False)

def save_todos():
    pd.DataFrame(todos).to_excel(TODOS_FILE, index=False)

def get_user(username: str):
    for user in users:
        if user["username"] == username:
            return user
    return None

def create_access_token(data: dict, expires_delta: datetime.timedelta):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Регистрация
@app.post("/register")
def register(user: User):
    if get_user(user.username):
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_password = get_password_hash(user.password)
    new_user = {"username": user.username, "password": hashed_password}
    users.append(new_user)
    save_users()
    return {"message": "Регистрация успешна"}

# Авторизация
@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Неверные учетные данные")

    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

# Декодирование токена
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Недействительный токен")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Срок действия токена истек")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Недействительный токен")

# Получение списка задач (только для авторизованных пользователей)
@app.get("/todos")
def get_todos(username: str = Depends(get_current_user)):
    user_todos = [
        {
            "id": i,
            "title": todo["title"],
            "description": todo["description"],
            "done": todo["done"],
            "created_at": todo["created_at"],
        }
        for i, todo in enumerate(todos) if todo["username"] == username
    ]
    return {"todos": user_todos}

# Добавление задачи (только для авторизованных пользователей)
@app.post("/todos")
def add_todo(todo: ToDoItem, username: str = Depends(get_current_user)):
    new_todo = {
        "username": username,
        "title": todo.title,
        "description": todo.description,
        "done": todo.done,
        "created_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")  # Дата создания
    }
    todos.append(new_todo)
    save_todos()
    return {"message": "Задача добавлена"}

# Обновление статуса задачи (выполнено/не выполнено)
@app.put("/todos/{todo_id}")
def update_todo_status(todo_id: int, done: bool, username: str = Depends(get_current_user)):
    if todo_id < 0 or todo_id >= len(todos) or todos[todo_id]["username"] != username:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    todos[todo_id]["done"] = done
    save_todos()
    return {"message": "Статус задачи обновлен"}

# Удаление задачи
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, username: str = Depends(get_current_user)):
    if todo_id < 0 or todo_id >= len(todos) or todos[todo_id]["username"] != username:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    del todos[todo_id]
    save_todos()
    return {"message": "Задача удалена"}

# Главная страница
@app.get("/")
def welcome():
    return {"message": "Зарегистрируйтесь или авторизуйтесь, чтобы увидеть свои задачи"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

