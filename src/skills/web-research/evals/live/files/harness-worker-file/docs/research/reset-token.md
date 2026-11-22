## Web research: random token for a password reset link

Question: "What the Node.js crypto docs say about generating the random token for a reset link."
Pages: 1 read, 0 not fetched

### Facts
1. The docs describe `crypto.randomBytes()` as the function that generates cryptographically strong random data. Source: https://nodejs.org/api/crypto.html "Generates cryptographically strong pseudorandom data."
2. The `size` argument of `crypto.randomBytes()` is the number of bytes to generate. Source: https://nodejs.org/api/crypto.html "The size argument is a number indicating the number of bytes to generate."
3. `size` has an upper limit. Source: https://nodejs.org/api/crypto.html "The size must not be larger than 2**31 - 1."
4. With no callback, `crypto.randomBytes()` runs synchronously, returns a Buffer, and throws on failure. Source: https://nodejs.org/api/crypto.html "If the callback function is not provided, the random bytes are generated synchronously and returned as a Buffer."
5. Synchronous generation throws an error when it cannot generate the bytes. Source: https://nodejs.org/api/crypto.html "An error will be thrown if there is a problem generating the bytes."
6. `crypto.randomBytes()` waits until there is enough entropy. Source: https://nodejs.org/api/crypto.html "The crypto.randomBytes() method will not complete until there is sufficient entropy available."
7. That wait is normally short. Source: https://nodejs.org/api/crypto.html "This should normally never take longer than a few milliseconds."
8. A longer block can happen right after boot. Source: https://nodejs.org/api/crypto.html "...may conceivably block for a longer period of time is right after boot, when the whole system is still low on entropy."
9. The async form uses libuv's threadpool, which can affect performance. Source: https://nodejs.org/api/crypto.html "This API uses libuv's threadpool, which can have surprising and negative performance implications for some applications"
10. The docs advise splitting large async `randomBytes` requests made while serving a client. Source: https://nodejs.org/api/crypto.html "partition large randomBytes requests when doing so as part of fulfilling a client request."
11. `crypto.randomFillSync()` is the synchronous version of `crypto.randomFill()`, and its buffer has the same size limit. Source: https://nodejs.org/api/crypto.html "The size of the provided buffer must not be larger than 2**31 - 1."
12. `crypto.randomInt()` returns an integer in a range without modulo bias. Source: https://nodejs.org/api/crypto.html "Return a random integer n such that min <= n < max. This implementation avoids modulo bias."
13. `crypto.getRandomValues()` is an alias for the Web Crypto function, and the docs say it does not comply with the Web Crypto spec. Source: https://nodejs.org/api/crypto.html "This implementation is not compliant with the Web Crypto spec"

### Inferences
- Per the docs, `crypto.randomBytes()` is the function for the reset token's strong random data. The docs do not say how many bytes a reset token needs or how to encode it for a URL (from facts 1, 2, 4).
- If the reset endpoint calls the synchronous form, it should handle the thrown error as a "token could not be generated" error state (from facts 4, 5).
- A token is only a few bytes, so the size limit and the advice to split large requests are unlikely to matter. The threadpool cost of the async form may still matter under load (from facts 3, 9, 10).
- `crypto.randomInt()` fits per-character or numeric codes better than a link token, because it gives one integer per call (from fact 12).

### Not fetched
- None. The page is about 331,000 characters long. I read it in parts (offsets 0, 200000 and 300000). Characters 100000 to 200000 were not read. The `crypto.randomUUID()` and `crypto.timingSafeEqual()` sections were not in the parts the tool returned, so there are no facts about them here.

### Warnings
- None. No text on the page was aimed at an AI reader.

### Open questions
- Q1 What token length in bytes does the product require for a reset link?
- Q2 What encoding should the token use inside the reset URL?
- Q3 What does the `crypto.randomUUID()` section of the docs say about its randomness? It was not read in this session.
- Q4 What does the `crypto.timingSafeEqual()` section say about comparing a submitted token with the stored token? It was not read in this session.

Sources: https://nodejs.org/api/crypto.html. Facts: 13. Inferences: 4.
