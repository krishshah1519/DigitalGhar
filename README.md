# DigitalGhar: Your Personal Document Vault 🔒

DigitalGhar is a secure, personal document vault designed to help you and your family organize, store, and access important documents with ease. Inspired by the need to avoid the last-minute rush for essential papers, this application provides a centralized and personalized digital space for all your vital information.

## ✨ Key Features

-   **Secure User Authentication**: JWT-based user registration and login system to protect your data.
-   **Folder-Based Organization**: Organize documents in customizable folders (e.g., "My Documents," "Family," "Financial").
-   **Complete Document Management**: Full CRUD (Create, Read, Update, Delete) functionality for both folders and documents.
-   **Tagging and Filtering**: Assign custom tags to documents for easy categorization and retrieval.
-   **Powerful Search**: A robust search bar to quickly find documents by name or tag across all your folders.
-   **Multi-File Support**: Upload and store various file types, including PDFs, JPEGs, PNGs, and text files.
-   **User Profile Management**: Easily update your personal information and change your password.
-   **Responsive UI**: A clean, modern, and fully responsive user interface built with Tailwind CSS.

---

## 🛠️ Tech Stack

| Category   | Technology                                                                                                                                                                                                                                                                                       |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwind_css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) |
| **Backend** | ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![Django REST Framework](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white)                                                               |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)                                                                                                                                                                         |

---

## 🚀 Getting Started

### Prerequisites

-   Node.js and npm (or yarn)
-   Python 3.7+ and pip
-   A running instance of a database supported by Django (e.g., PostgreSQL, MySQL, SQLite).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/digitalghar.git](https://github.com/your-username/digitalghar.git)
    cd digitalghar
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    pip install -r requirements.txt
    # Configure your .env file based on .env.example
    python manage.py migrate
    python manage.py runserver
    ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    # Ensure your .env file points to the backend API (VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000))
    npm run dev
    ```

---

## 🌟 Future Vision

DigitalGhar is built to be scalable. Here are some of the exciting features planned for future releases:

-   **Mobile Application**: A dedicated mobile app for iOS and Android to access your documents on the go.
-   **Enhanced Sharing**: Securely share documents or entire folders with family members or external parties via encrypted links or platforms like WhatsApp.
-   **Optical Character Recognition (OCR)**: Implement OCR to extract text from scanned documents and images, making every document fully searchable.
-   **Duplicate Detection**: An intelligent system to identify and flag duplicate documents, helping to keep your vault clean and organized.
-   **Cloud Storage Integration**: Integrate with cloud storage providers like AWS S3 or Google Cloud Storage for robust, scalable, and secure file storage with encryption at rest.