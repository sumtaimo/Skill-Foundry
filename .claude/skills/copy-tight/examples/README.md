# Examples

## 1. Error message

Input: "shorten this copy: We were unable to process your payment of $49.00 at this time. Please try again later."

Rewritten copy:
Payment of $49.00 failed. Try again later.

What changed:
- Dropped the time phrase and made the failure the subject
- Kept the amount $49.00 and the later retry

## 2. Button

Input: "make this plain: Click here in order to proceed to Checkout"

Rewritten copy:
Go to Checkout

What changed:
- Started with the verb and dropped the instruction
- Kept the name "Checkout"

## 3. Legal text (unchanged)

Input: "tighten this text: By continuing you agree to the Terms of Service."

Rewritten copy:
By continuing you agree to the Terms of Service.

What changed:
Legal text is returned unchanged.

## 4. A list of strings (nothing dropped)

Input: "tighten these, keep the Proof label as is: 1) Click here in order to proceed to Checkout 2) Real output from an agent [keep] 3) Save changes 4) By continuing you agree to the Terms of Service."

Rewritten copy:

| ID | Before | After | Saved | Reason |
|---|---|---|---|---|
| 1 | Click here in order to proceed to Checkout | Go to Checkout | 28 | Started with the verb and dropped the instruction; name kept |
| 2 | Real output from an agent | Real output from an agent | 0 | Kept: marked keep as is |
| 3 | Save changes | Save changes | 0 | Kept: already tight |
| 4 | By continuing you agree to the Terms of Service. | By continuing you agree to the Terms of Service. | 0 | Kept: legal text. Legal text is returned unchanged. |

What changed:
- 4 strings in, 4 rows out: 1 changed, 3 kept.
- Total characters saved: 28.

## 5. A long string (split into sentences)

Input: "shorten this copy: Your subscription will renew automatically on 3 January 2027 for $12.00 unless you cancel it before that date from the Billing page, and we will email you a receipt after every payment."

Rewritten copy:
Your subscription renews on 3 January 2027 for $12.00. Cancel before then on the Billing page. We email a receipt after every payment.

What changed:
- Split one long sentence into three; each keeps one idea
- Kept the date, the amount and the name "Billing"
