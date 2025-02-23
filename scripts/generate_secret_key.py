from django.core.management.utils import get_random_secret_key

if __name__ == '__main__':
    secret_key = get_random_secret_key()
    print("\nГенерация нового SECRET_KEY для Django:\n")
    print(f"SECRET_KEY='{secret_key}'")
    print("\nДобавьте эту строку в ваш .env файл\n")
