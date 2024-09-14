from celery import shared_task
from openai import OpenAI
from dotenv import load_dotenv
import replicate

load_dotenv()


@shared_task(bind=True)
def test(self):
    print("life suck hard when you don't have any life")

@shared_task(bind=True)
def get_content_from_image(self, data):
    
    for url in data:
        client = OpenAI()

        response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "describe the description of the image, what is he doing, where is he or other"},
                {
                "type": "image_url",
                "image_url": {
                    "url": url,
                },
                },
            ],
            }
        ],
        max_tokens=300,
        )

        img_description = str(response.choices[0].message.content)

        ### refine the image description using AI

        ### convert the image description to embedding and save it in db 

    return

@shared_task(bind=True)
def get_3d_from_image(self, data):
    
    input = {
    "image": data
    }

    output = replicate.run(
        "mareksagan/dreamgaussian:d16b4890fd9d1996aa7e018c261237e3c4157d20489773f3022ef10de6c06909",
        input=input
    )
    print(output)
    return
