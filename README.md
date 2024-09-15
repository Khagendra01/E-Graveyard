# E-Graveyard: Where Your Loved Ones are Remembered Forever!

## Inspiration

Imagine having a conversation with a loved one who's no longer with you or an inspirational figure you admire. Our project allows you to do just that through digital conversations with their cloned voice, providing comfort, support and inspiration.

This innovative technology helps you cope with loss and improve your mental well-being by processing grief, reflecting on cherished memories and gaining inspiration and guidance. Our platform offers a unique way to connect with those who matter most, enhancing your mental health and resilience.

By preserving memories and stories, our project also ensures legacies live on for future generations. Experience the power of digital conversations and find solace in the voices that matter.

## What it does

E-Graveyard is an innovative platform that allows users to interact with digital representations of deceased loved ones or inspirational figures. Here's what our project offers:

1. Users can create or choose AI personalities based on real people who have passed away or other figures they admire.

2. Users provide information about the person, including biographical details, personal anecdotes, and characteristic traits.

3. Users can upload a picture of the person to create a visual anchor for the AI personality.

4. Utilizing a Retrieval-Augmented Generation (RAG) architecture with a PostgreSQL vector database, the AI can engage in meaningful conversations based on the provided information.

5. The AI's responses are not only text-based but also delivered using the cloned voice, creating a more personal and emotional connection.

## How we built it

Our project combines cutting-edge technologies like Retrieval-Augmented Generation, PostgreSQL Vector Database and voice cloning from Eleven Labs API. We used React, Django and PostgreSQL for the frontend and backend, ensuring efficient similarity searches and contextually relevant responses and used auth0 of the authentication flow for both frontend and backend.

## Challenges we ran into

Throughout the development process, we encountered several challenges:

1. Network Configuration: Hosting the backend and frontend on different networks posed connectivity issues, which we resolved using ngrok for tunneling.

2. Document Splitting: Langchain's Document Splitter struggled with our input format, so we developed a custom splitting function and it worked perfectly.

3. Embedding Retrieval: We had to ensure correct retrieval of embeddings and associated documents which required implementing a custom vector database using pgvector with postgres database.

4. Chat Agent Recursion: Our custom chat agent initially fell into recursive loops due to embedding retrieval errors, which needed careful resolution. We started from the basic “hello world” function and slowly made it advanced and made it to reply based on the user’s content.

## Accomplishments that we're proud of

1. Auth0 Integration: We successfully implemented Auth0 for secure and efficient authentication, significantly boosting our productivity.

2. Voice Cloning Quality: We fine-tuned voice cloning parameters to achieve high-quality, realistic voice outputs.

3. Responsive UI: We developed a user interface with intuitive loading states and efficient response caching for a smooth user experience.

4. Custom Vector Database: By using pgvector, we created a custom vector storage solution integrated with our existing PostgreSQL database, allowing for greater flexibility and faster responses.

5. RAG Implementation: We successfully implemented a Retrieval-Augmented Generation system, enhancing the AI's ability to provide accurate and contextually relevant responses.

## What we learned

This project provided numerous learning opportunities:

1. Collaboration Tools: We gained experience with LiveShare for real-time code collaboration.

2. Network Troubleshooting: We improved our skills in diagnosing and resolving network-related issues in distributed applications.

3. Form Validation: We implemented robust form validation using Zod and learned to create effective validation schemas.

4. Vector Databases: We expanded our knowledge of vector databases, specifically pgvector, and their applications in AI-powered systems.

5. RAG Architecture: We deepened our understanding of Retrieval-Augmented Generation and its implementation in real-world applications.

6. Voice Cloning Technology: We gained insights into the capabilities and implementation of voice cloning ElevenLabs API.

7. AI Interaction Design: We learned to create more natural and context-aware AI interactions.

## What's next for E-Graveyard

We have exciting plans for the future of E-Graveyard:

1. Tribute System: Implement a feature allowing visitors to leave tributes on personality pages, incorporating this data into the AI's knowledge base.

2. Interactive 3D Models: Integrate Replicate's Flux model to generate interactive 3D models of personalities for a more immersive experience.

3. Speech-to-Text Interface: Develop a speech recognition system to allow users to interact with personalities using voice commands.

4. Phone Call Functionality: Create a system that enables users to "call" and converse with AI personalities over the phone.

5. Expanded Personality Database: Continually add new historical figures and allow for community contributions to grow our library of interactive personalities.

6. Ethical Guidelines: Develop and implement strict ethical guidelines for creating and interacting with digital representations of deceased individuals.

7. Mobile App: Create a dedicated mobile application for easier access and improved user experience on smartphones and tablets.

8. Group Interactions: Enable multiple users to interact with a personality simultaneously, fostering shared experiences and discussions.

By continuing to innovate and expand E-Graveyard, we aim to create a platform that not only preserves memories but also provides comfort, inspiration, and support for users around the world.
