from tortoise import Tortoise
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def run():
    db_url = os.getenv("DATABASE_URL")
    print(f"Testing DB URL: {db_url}")
    try:
        await Tortoise.init(
            db_url=db_url,
            modules={'models': ['app.models.models']}
        )
        print("Init success!")
        await Tortoise.generate_schemas()
        print("Schema generation success!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await Tortoise.close_connections()

if __name__ == "__main__":
    asyncio.run(run())
