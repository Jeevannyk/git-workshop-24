"""
View stored contact form submissions.
Run from the backend folder:  python view_contacts.py
"""

import sqlite3
import os

DATABASE = os.path.join(os.path.dirname(__file__), 'contacts.db')


def main():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        'SELECT id, name, email, subject, message, submitted_at '
        'FROM contacts ORDER BY id DESC'
    ).fetchall()
    conn.close()

    if not rows:
        print("No submissions yet.")
        print("(Make sure 'python app.py' is running when someone submits the form.)")
        return

    print(f"\n{len(rows)} submission(s):\n" + "=" * 50)
    for r in rows:
        print(f"#{r['id']}  -  {r['submitted_at']}")
        print(f"  Name:    {r['name']}")
        print(f"  Email:   {r['email']}")
        print(f"  Subject: {r['subject'] or '(none)'}")
        print(f"  Message: {r['message']}")
        print("-" * 50)


if __name__ == '__main__':
    main()
