
# Harvesta: Technical Architecture Documentation

## 1. Overview

Harvesta is a modern, serverless-first web application designed as an all-in-one digital toolkit for farmers. It leverages a powerful stack including Next.js for the frontend, Firebase for the backend, and Google's Genkit for AI-powered features.

---

## 2. Frontend Architecture: Next.js & React

The user interface is a high-performance application built with the Next.js 14 App Router.

-   **Location:** The core frontend code resides in the `src/app` directory.
-   **Routing:** File-based routing is used. For example, the file `src/app/dashboard/marketplace/page.tsx` automatically creates the `/dashboard/marketplace` URL path.
-   **Rendering Strategy:**
    -   **Server Components (Default):** Most pages are rendered on the server for fast initial load times and improved SEO. They handle data fetching before sending the final HTML to the client.
    -   **Client Components (`'use client'`):** Components requiring user interactivity (e.g., forms, buttons with `onClick` handlers, `useState`, `useEffect`) are explicitly marked with the `'use client'` directive. This is a key Next.js performance feature.
-   **Layouts (`layout.tsx`):** The application uses layouts to create a consistent UI shell. For instance, `src/app/dashboard/layout.tsx` defines the main dashboard structure, including the header and sidebar, which wrap all nested pages.

---

## 3. Styling: Tailwind CSS & ShadCN UI

The visual design is modern, responsive, and themeable, built with a utility-first approach.

-   **Location:**
    -   Global styles and theme variables (CSS custom properties) are in `src/app/globals.css`.
    -   Reusable UI components are located in `src/components/ui`.
-   **How it Works:**
    -   **Tailwind CSS:** A utility-first CSS framework that allows for rapid styling directly within JSX components (e.g., `className="bg-primary text-white p-4"`). The configuration is in `tailwind.config.ts`.
    -   **ShadCN UI:** A collection of pre-built, accessible, and themeable React components. These are not installed as a library but are part of the project's source code, allowing for full customization. Components like `Button`, `Card`, and `Dialog` provide a consistent look and feel.

---

## 4. Backend & Database: Firebase

Harvesta uses Firebase as its serverless backend, handling user authentication, database, and file storage without the need to manage a dedicated server.

-   **Location:**
    -   Firebase initialization and core configuration are in the `src/firebase` directory.
    -   The database schema blueprint is defined in `docs/backend.json`.
-   **Key Services:**
    -   **Firebase Authentication:** Manages secure user sign-up, login, and sessions. The logic is primarily handled in the `src/app/(auth)` pages and the global `src/hooks/use-auth.tsx` provider. This provider is a cornerstone of the app, protecting routes and making user data globally available.
    -   **Firestore (NoSQL Database):** Stores all application data, including user profiles, marketplace listings, and messages. Firestore's real-time capabilities are leveraged via custom hooks (`useCollection`, `useDoc`), which automatically update the UI when data changes in the backend.
    -   **Error Handling:** The app includes a robust, developer-focused error handling system (`src/firebase/errors.ts`, `src/firebase/error-emitter.ts`) that intercepts Firestore permission errors and formats them into detailed, actionable messages to simplify the debugging of security rules.

---

## 5. Generative AI: Google's Genkit

The application's intelligence—such as crop recommendations and farm reports—is powered by Google's Genkit, which integrates with the Gemini family of AI models.

-   **Location:** AI logic resides in `src/ai/flows`, with configuration in `src/ai/genkit.ts`.
-   **How it Works:**
    -   **AI Flows:** These are server-side TypeScript functions that orchestrate calls to the AI model. For example, `src/ai/flows/crop-suggestion.ts` defines a function to get crop advice.
    -   **Structured Prompts:** Within each flow, a carefully crafted prompt is defined. This prompt instructs the AI on its persona (e.g., "You are an expert agronomist"), the task to perform, and crucially, the exact JSON schema for the output. This ensures the data returned by the AI is predictable and easy to use.
    -   **UI Integration:** Frontend components simply call these async flow functions, pass the necessary user input (like form data), and render the structured JSON response from the AI.

---

## 6. Overall Data Flow (Example: AI Suggestion)

1.  A user navigates to the `/dashboard/recommendations` page.
2.  The React component, marked `'use client'`, renders a form. The user's location and current crops are pre-filled using data from the `useLocation` and `useAuth` hooks.
3.  Upon form submission, the component calls the `suggestCrops` function from `src/ai/flows/crop-suggestion.ts`.
4.  This server-side **Genkit flow** constructs a prompt with the user's data and sends it to the **Gemini AI model**.
5.  The AI model processes the request and returns a structured JSON object containing short-term advice, long-term outlook, and monthly trends.
6.  The `suggestCrops` function returns this JSON to the frontend component.
7.  The component updates its state with the AI-generated data, and React re-renders the UI to display the recommendations in formatted cards and lists.
