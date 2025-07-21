# InvoiceAI

## Project Overview

InvoiceAI is a comprehensive web application designed to streamline invoice management and data extraction. It leverages AI capabilities to automatically extract key information from invoice documents, allows users to manage custom fields, and provides robust authentication and team management features. The application aims to simplify financial record-keeping and data processing for individuals and organizations.

## Features

*   **User Authentication:** Secure sign-up, sign-in, password reset, and team sign-up functionalities powered by Supabase Auth.
*   **Invoice Document Management:** Upload, store, and manage invoice documents (PDFs and images).
*   **Automated Data Extraction:** AI-powered extraction of standard and custom fields from invoices.
*   **Custom Field Management:** Users can define and manage their own custom fields for extraction.
*   **Document History & Search:** View uploaded document history and filter by date.
*   **Team Management:** Features for managing clients within an organization, including status updates and detail modifications.
*   **Admin Dashboard:** (If applicable) Analytics and overview for administrators.
*   **Responsive UI:** Built with Next.js and Shadcn UI for a modern and responsive user experience.

## Technologies Used

*   **Framework:** Next.js 15.3.2 (App Router)
*   **Database & Authentication:** Supabase
*   **UI Components:** Shadcn UI
*   **Styling:** Tailwind CSS
*   **Image Viewer:** React Zoom Pan Pinch
*   **Type Checking:** TypeScript

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v18.x or later recommended)
*   npm (Node Package Manager) or Yarn
*   Git
*   A Supabase account and project setup (with necessary tables and RLS policies for `profiles`, `invoice_documents`, `invoice_extractions`, `team_clients_table`, `invoice_fields`, and `teams_table`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Hemanathanv/invoiceai-nextapp.git
    cd invoiceai-nextapp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Add Shadcn UI components:**
    This project uses Shadcn UI. Run the following command to initialize and add all necessary components:
    ```bash
    npx shadcn@latest add --all
    ```

4.  **Install specific peer dependencies for `react-zoom-pan-pinch` and Supabase:**
    ```bash
    npm i react-zoom-pan-pinch --legacy-peer-deps
    npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps
    ```

### Configuration

Create a `.env.local` file in the root of your project and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project URL and public anon key, respectively.

### Running the Development Server

To start the application in development mode:

```bash
npm run dev
# or yarn dev
```

npm install

npx shadcn@latest add --all

npm i react-zoom-pan-pinch --legacy-peer-deps

npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps

npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will hot-reload as you make changes.

## Project Structure

Key directories and their purposes:

*   `actions/`: Server actions for authentication and other server-side operations.
*   `app/`: Contains Next.js pages, layouts, and API routes.
    *   `app/(user)/`: User authentication related pages (login, register, forgot password).
    *   `app/admin/`: Admin dashboard pages and components.
    *   `app/dashboard/`: User dashboard pages and components.
        *   `app/dashboard/_components/_services/`: Service files for invoice field management and document uploads.
    *   `app/extractions/`: Pages and components related to invoice data extraction.
        *   `app/extractions/service/`: Service files for invoice extraction data fetching and image handling.
    *   `app/teams/`: Team management related pages and components.
        *   `app/teams/dashboard/_service/`: Service files for team client management.
*   `components/`: Reusable React components.
    *   `components/ui/`: Shadcn UI components.
    *   `components/user/`: User-specific UI components (e.g., forms).
*   `public/`: Static assets.
*   `types/`: TypeScript type definitions (e.g., `profile.ts`, `invoice.ts`).
*   `utils/supabase/`: Supabase client and server utilities, including middleware for session management.

## API Documentation

The core business logic and data interactions are encapsulated in server actions and service files. Detailed API documentation, including parameter descriptions, return values, and usage examples, can be found directly within the source code using JSDoc comments.

Refer to the following files for detailed API insights:

*   **Authentication:** `actions/auth.ts`
*   **Supabase Middleware:** `utils/supabase/middleware.ts`
*   **Invoice Upload & Document Management:**
    *   `app/dashboard/_components/_services/uploadbox.service.ts`
    *   `app/dashboard/_components/_services/invoiceFieldsService.ts`
*   **Invoice Data Extraction & Image Handling:**
    *   `app/extractions/service/extraction.service.ts`
    *   `app/extractions/service/ZoomableImage.service.ts`
*   **Team Client Management:** `app/teams/dashboard/_service/client_service.ts`
*   **Type Definitions:** `types/profile.ts`, `types/invoice.ts`


## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.