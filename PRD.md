# Product Requirements Document (PRD): Lumina - AI Rental Search

## 1. Product Overview
Lumina is an intelligent, AI-powered real estate rental concierge designed to revolutionize the apartment hunting experience. By leveraging advanced Large Language Models (LLMs), Lumina provides a conversational, context-aware interface that guides users from initial discovery and style analysis all the way through to application, lease signing, and move-in preparation.

## 2. Target Audience
*   Renters looking for a streamlined, personalized apartment search experience.
*   Users who prefer conversational interfaces over traditional form-based search filters.
*   Renters who need guidance through the complex leasing process (applications, contracts, move-in).

## 3. Core Features & Requirements

### 3.1. Conversational AI Assistant (Lumina)
*   **Natural Language Search:** Users can describe their ideal home in plain English (e.g., "A modern loft in SoHo under $3000 with a gym").
*   **Context Awareness:** The AI must maintain context of the conversation and the specific property the user is currently viewing.
*   **Structured Output:** The AI engine must return structured JSON containing conversational replies, extracted search filters, user intents, and interactive UI triggers.
*   **Suggested Replies:** The chat interface must display 3-4 contextually relevant suggested replies to speed up user interaction.
*   **Resilience:** If the AI API quota is exceeded, the system must gracefully fall back to providing mock data and a friendly error message, allowing the user to continue exploring the app.

### 3.2. Property Discovery & Filtering
*   **Filter Extraction:** The system must automatically extract filters (Location, Min/Max Price, Min Bedrooms, Amenities, Property Type) from the user's chat messages.
*   **City/Neighborhood Selection:** Users can manually filter by popular locations (e.g., Downtown, SoHo, Brooklyn Heights).
*   **Lifestyle Comparison:** When multiple properties match a query, the UI must present a comparative view of the options.
*   **Favorites:** Users must be able to save/favorite properties for later review.

### 3.3. Interactive Chat UI Components
The chat interface must render dynamic, interactive components based on the AI's determined `interactiveType`:
*   **`properties`**: Displays a list or carousel of matching property cards.
*   **`deep-dive`**: Displays a focused, detailed card for a single property, including images, specs, and amenities.
*   **`style-analysis`**: Displays a "Style Profile" containing an AI-generated Title, Avatar (emoji), and Summary based on user-provided descriptions or links. Users must be able to edit and confirm this profile.
*   **`application-form`**: Renders a mock application flow (e.g., ID upload, background check initiation).
*   **`contract`**: Displays a lease agreement summary and payment interface.
*   **`move-in-checklist`**: Provides a post-signing checklist (keys, utilities, insurance).

### 3.4. Live Audio Mode (Gemini Live)
*   **Real-Time Voice:** Users must be able to interact with Lumina using real-time voice conversations.
*   **Audio Visualization:** The UI must include a visualizer indicating when the user is speaking and when the AI is responding.

### 3.5. Chat History & Threading
*   **Session Management:** The app must support multiple chat threads (e.g., a general search thread vs. a thread dedicated to a specific property).
*   **History Drawer:** Users must be able to access and switch between past conversations.

## 4. Technical Architecture

### 4.1. Tech Stack
*   **Frontend Framework:** React 18 with Vite.
*   **Styling:** Tailwind CSS.
*   **Animations:** Framer Motion (`motion/react`).
*   **Icons:** `lucide-react`.
*   **AI SDK:** `@google/genai`.

### 4.2. AI Models
*   **Text/Reasoning:** `gemini-3-pro-preview` (used for complex query analysis, filter extraction, and structured JSON generation).
*   **Real-Time Audio:** `gemini-2.5-flash-native-audio-preview-12-2025` (used for the Live Audio Mode).

### 4.3. Data Management
*   **Property Data:** Currently utilizing a local mock database (`MOCK_PROPERTIES`).
*   **State Management:** React local state (`useState`, `useReducer`, `useRef`).

## 5. Future Enhancements (Out of Scope for Current Version)
*   Integration with a live real estate API/database (e.g., Zillow, MLS).
*   User authentication and persistent cloud storage for favorites and chat history.
*   Actual payment gateway integration for lease signing.
*   Real-time touring scheduling system.
