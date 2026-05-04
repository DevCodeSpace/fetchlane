# 🚀 FetchFlow

**Lightweight React data-fetching utility with caching, retry, and request deduplication.**

Simplify API handling in your React apps — no more repetitive loading, error, and state management.

---

## 📦 Installation

```bash
npm install fetchflow
```

---

## ⚡ Quick Usage

```jsx
import { SmartLoader } from "fetchflow";

const getUser = async () => {
  const res = await fetch("/api/user");
  return res.json();
};

<SmartLoader api={getUser}>
  {(data) => <UserCard user={data} />}
</SmartLoader>;
```

---

## ✨ Features

* 🔄 Automatic API execution
* ⏳ Built-in loading state
* ❌ Flexible error handling
* ⚡ Smart caching with TTL
* 🔁 Retry failed requests
* 🚫 Request deduplication (no duplicate API calls)
* ⏱️ Optional loading delay (better UX)
* 🐛 Debug mode for development
* 🎯 Clean and minimal API

---

## 📌 Component Example

```jsx
<SmartLoader
  api={getUser}
  skeleton={<p>Loading...</p>}
  error={(err) => <p>{err.message}</p>}
>
  {(data) => <UserCard user={data} />}
</SmartLoader>
```

---

## 🛠️ Hook Usage

```jsx
import { useSmartLoader } from "fetchflow";

const { data, loading, error, refetch } = useSmartLoader(getUser, {
  cache: true,
  ttl: 5000,
  retry: 2,
  delay: 300,
  debug: false,
});
```

---

## ⚙️ Options

| Option | Type    | Default | Description                 |
| ------ | ------- | ------- | --------------------------- |
| cache  | boolean | true    | Enable caching              |
| ttl    | number  | -       | Cache expiry time (ms)      |
| retry  | number  | 0       | Retry failed requests       |
| delay  | number  | 0       | Delay before showing loader |
| debug  | boolean | false   | Enable debug logs           |
| key    | string  | auto    | Custom cache key            |

---

## 🔄 How It Works

```text
API Call
   ↓
Check Cache
   ↓
Check Pending Request (Deduplication)
   ↓
Execute API
   ↓
Store in Cache
   ↓
Return Data
```

---


## 🎯 When to Use

Use FetchFlow when you want:

* Simple API handling without heavy libraries
* Lightweight alternative to React Query
* Clean and readable code

---

## 📄 License

MIT © 2026 FetchFlow Contributors

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 💬 Support

If you have any questions or issues, please open an issue on the GitHub repository.
