import logging
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InputFile
from aiogram.utils import executor

TOKEN = "YOUR_BOT_TOKEN"

logging.basicConfig(level=logging.INFO)
bot = Bot(token=TOKEN)
dp = Dispatcher(bot)

menu_keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
menu_keyboard.add(KeyboardButton("🎁 Подарки"), KeyboardButton("👕 Мерч"))
menu_keyboard.add(KeyboardButton("📦 Оформить заказ"))

products ={
"Наборы":[],
    "🎁 Подарки": [
        {"name": "Мягкая игрушка", "price": "500 руб", "photo": "toy.jpg"},
        {"name": "Шоколадный набор", "price": "300 руб", "photo": "chocolate.jpg"}
    ],
    "👕 Мерч": [
        {"name": "Футболка с логотипом", "price": "800 руб", "photo": "tshirt.jpg"},
        {"name": "Кепка", "price": "600 руб", "photo": "cap.jpg"}
    ]
}

cart = {}

@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
    await message.answer("Привет! Добро пожаловать в наш магазин! Выберите категорию:", reply_markup=menu_keyboard)

@dp.message_handler(lambda message: message.text in products.keys())
async def show_products(message: types.Message):
    category = message.text
    for item in products[category]:
        with open(item["photo"], "rb") as photo:
            await bot.send_photo(message.chat.id, photo, caption=f"{item['name']} - {item['price']}\nНапишите название товара, чтобы добавить в корзину.")

@dp.message_handler(lambda message: any(item["name"] in message.text for cat in products.values() for item in cat))
async def add_to_cart(message: types.Message):
    item_name = message.text
    for category in products.values():
        for item in category:
            if item_name in item["name"]:
                if item_name in cart:
                    cart[item_name] += 1
                else:
                    cart[item_name] = 1
                await message.answer(f"{item_name} добавлен в корзину! 🛒")
                return

@dp.message_handler(lambda message: message.text == "📦 Оформить заказ")
async def checkout(message: types.Message):
    if not cart:
        await message.answer("Ваша корзина пуста! Добавьте товары перед оформлением заказа.")
    else:
        order_summary = "\n".join([f"{key} x{value}" for key, value in cart.items()])
        await message.answer(f"Ваш заказ:\n{order_summary}\n\nСпасибо за покупку! 🛍")
        cart.clear()

if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
