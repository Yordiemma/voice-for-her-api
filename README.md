# Voice for Her – API

Voice for Her is a backend API built to support **anonymous abuse reporting** in a safe, privacy-first, and real-world responsible way.

The API allows people to report abuse without creating an account, while still giving them the option to leave contact information if they want help. The system is designed to protect users, prevent misuse, and keep the data trustworthy.

---

## What This API Is For

The purpose of this API is to:

* Collect anonymous abuse reports
* Protect the privacy and safety of users
* Prevent spam and fake reports
* Provide aggregated data for awareness and statistics
* Follow real-world backend and security practices

This API focuses only on **reporting and awareness**, not user accounts or social features.

---

## Core Design Decisions

* Reports are anonymous
* No login or account is required
* Reports cannot be edited or deleted
* Optional contact information can be removed
* The frontend is not trusted
* Security is enforced at the API level

---

## Data Collected

Each abuse report contains:

* **abuseType** (required)
  Selected from a fixed list such as physical, verbal, emotional, sexual, or online.

* **age** (required)
  A number provided by the user.

* **country** (required)
  Selected from a list of countries.

* **contactInfo** (optional)
  Email address or phone number, only if the user wants support.

* **createdAt**
  Automatically generated timestamp.

* **contactRemovalToken**
  A secure token generated only if contact information is provided.

---

## API Endpoints

### POST /reports

Creates a new abuse report.

This endpoint allows a user to submit an abuse report anonymously.

What happens:

* Input data is validated
* The report is saved
* If contact information is included:

  * A secure token is generated
  * The token is returned once
  * The user is instructed to save the token

---

### DELETE /reports/:id/contact

Removes optional contact information.

This endpoint removes only the email address or phone number associated with a report. The abuse report itself is not modified or deleted. A valid contact removal token is required.

---

### GET /reports/stats

Returns aggregated statistics.

This endpoint provides summary data used for charts and graphs, such as reports per country or abuse type. No personal or identifiable information is returned.

---

## Abuse Prevention and Rate Limiting

* IP-based rate limiting is used
* An IP address may submit a maximum of **two reports within three hours**
* Additional requests are temporarily blocked when the limit is exceeded
* Rate-limit data is stored in memory

---

## Security

* Reports are immutable
* Contact information is optional and removable
* Contact removal requires a secure token
* Tokens are generated once and stored securely
* IP addresses are used only for abuse prevention
* optional contact infornation  is not exposed through public endpoints

---

## Summary

Voice for Her is a backend API designed for anonymous abuse reporting with a focus on privacy, security, and responsible data handling using proper HTTP and REST principles.

---
Got it. **Ultra-simple. No extras. No explanations.**
This is the cleanest possible version.

You can paste this directly into your README.

---

## How to Run the API

1. Clone the repository

```bash
git clone https://github.com/Yordiemma/voice-for-her-api.git



2. Install dependencies


npm install


3. Create a `.env` file and add the required environment variables.

4. Start the server


node App.js


5. The API runs at


http://localhost:3000


---

## Endpoints

* `GET /`
* `POST /reports`
* `DELETE /reports/contact`
* `GET /stats`

---
