# Logged-out experience and sign-up flow

Audited on 25 Oct 2026, mobile web (393 x 852 at 3x), user logged out. Screenshots: `docs/screens/09_Logged-out/` (folders `signup`, `gating`, `marketing`, `browse`).
No account was created, no card or email was entered, and no form was submitted. The one deliberate stop was Stripe checkout (see S9).

## 1. How a logged-out visitor moves through the product

**Bottom bar (5 tabs):** Recipes, Learn, Resources, About, Login. Logged-in users get Recipes, Plan, Progress, Saved, Learn, About. So Plan, Progress and Saved are not visible at all when logged out, and tab positions shift once you log in.

**Header:** logo plus a "Download app" pill on every page. Profile does not appear.

**What is open without an account**
| Area | Logged-out behaviour |
|---|---|
| Home `/` (same page as `/lp/app/`) | Marketing page. Only App Store and Google Play buttons (repeated 4 times). No web sign-up or login link in the page body. |
| Recipes home, lists, search, filters | Fully browsable. Carousels carry "FREE!" ribbons on some recipes and upsell banners between rows. |
| Recipe detail, FREE recipe | Everything visible (overview, nutrition, ingredients with amounts, full method). |
| Recipe detail, other recipes | Overview and nutrition visible. Ingredients show names with lock icons, amounts hidden, list fades out after about 5 rows. Method shows step 1 then a banner. |
| Heart, add to plan | Modal: "Create an account to save your progress" (free account). |
| AI chat (bar and chips) | Modal: "How your free trial works", with a blue notice "You need to be subscribed to use this feature". |
| Learn, Resources (free downloads) | Open. Resources not tested beyond the list. |
| `/meal_plans/`, `/progress/`, `/profile/*` | Redirect to `/auth/login.php?redirect_to=...` with a yellow banner: "You'll need to login (or register) to view that page". |
| `/saved`, `/onboarding` | 404 (not routes). |

**Three access levels exist but are never explained:** anonymous, free account, subscriber.

## 2. The four routes into an account

| Route | Entry | Fields asked | Result |
|---|---|---|---|
| A. Sign-up page | Login "Sign up here", banner "register", `/auth/signup.php` | Email, password (min 8), first name, last name, newsletter checkbox, terms checkbox | Standard account (not submitted) |
| B. Account modal | Heart, add to plan | Email, password (min 8), terms | Free account (not submitted) |
| C. Free trial | "Start free trial", "Tell me more", chat, locked recipe banners | Plan choice, then Stripe: email and payment method | Live Stripe checkout. Unknown whether and how an account is created. Stopped. |
| D. Sign in with Apple | Every auth surface | Apple | Not tested (third-party auth) |
| E. App download | Header pill, marketing page | App Store / Google Play | Out of scope on web |

## 3. Sign-up flow, screen by screen

Each step lists what is on screen, what we verified, and what we could not.

**S1. Entry: gated page redirect** (`signup/01`)
Yellow banner "You'll need to login (or register) to view that page", then Login form. Whoever hits Plan or Progress arrives at Login, not Sign up. "register" is a small lowercase link. Page does not say which page was blocked or what they would get.

**S2. Login page** (`signup/01`)
Title Login, "Sign in with Apple" button, Email, Password with show/hide, "Forgot your password?", Log in, "Haven't got an account? Sign up here". Tab bar highlights Login. The Login tab link carries a nested `redirect_to` (it points back at itself), which could send a user back to Login after they log in.

**S3. Forgot password** (`signup/02`)
Separate page `/auth/forgot.php?email=`, with Email and "Send password reset". No heading context beyond the title, no "back to login" link, and the email is carried in the URL query string. Submit not tested.

**S4. Sign-up page** (`signup/03`, `04`)
Title Sign up, "Sign in with Apple" (on a sign-up page), Email (autofocused), Choose password (show/hide), First name, Last name, newsletter checkbox ("Keen for our weekly newsletters with recipe suggestions?", unchecked), Terms and Privacy checkbox (required, links open in a new tab), Sign up, "Already have an account? Log in here".
Verified in the DOM: form is `novalidate`, email/password/first/last/terms are required, password `minlength=8`, password `autocomplete="one-time-code"`, hidden error strings exist for each field ("Please enter a valid email address", "Please enter a password with at least 8 characters", "Please enter a first name", "Please enter a last name", "You must accept the terms to continue").
Verified on screen: typing an invalid email ("test") and leaving the field shows no inline error (`signup/05`). Errors only appear after submit.
Not tested: what Sign up does next (empty submit would show errors; a valid submit creates an account).

**S5. Account modal** (`signup/06`, `07`)
Bottom sheet "Create an account to save your progress. You need a free account to use this feature." Two buttons: "Sign in with Apple" and "Sign in with Email". The email option expands Email, Choose password, terms checkbox, Sign up, "Already have an account? Log in here". No names, no newsletter option.

**S6. Free trial modal** (`signup/08`, `gating/01`)
"How your free trial works": timeline (Today: trial begins, 29th Oct: reminder sent, 1st Nov: subscription starts), three plans (Yearly £79.99 save 33%, Quarterly £27.99, Monthly £9.99, each also shown per day), green "Start for £0", small legal text. Reached from "Start free trial" and "Tell me more". When opened from chat it adds a blue notice.

**S7. Stripe checkout** (`signup/09`)
Tapping "Start for £0" went straight to a live Stripe page on `checkout.thedoctorskitchen.com`: "Try Yearly, 7 days free, then £79.99 per year starting November 1, 2026", Email, payment method (Card, Revolut Pay, Klarna), blue "Start trial". **I stopped here.** There was no login or account step before it.

**S8. After checkout** (not reached)
Unknown: account creation, password setup, welcome email, onboarding steps. Needs a decision (see section 6).

## 4. Findings

Severity: High / Medium / Low. Type: IA, Interaction, Visual, Content, Accessibility, Bug.

### Sign-up flow
| ID | Sev | Type | Where | Finding | Direction |
|---|---|---|---|---|---|
| L1 | High | IA | All routes | Four sign-up routes ask for different data (names only on the full page; payment only on the trial route) and end in unknown states. Users on different routes end up with different accounts. | One canonical flow with the same fields and one outcome; entry points only change the framing. |
| L2 | High | Interaction | Trial modal to Stripe | "Start for £0" goes to live checkout with no account step shown first. Unclear whether an account exists afterwards, how a password is set, or what happens if the user abandons. | Make the account step explicit before payment, or explain it on the page. |
| L3 | High | Content | "Tell me more" | The label promises information but opens the purchase modal, the same destination as "Start free trial". | Link to a real explanation, or rename the button. |
| L4 | High | IA | Bottom bar | Plan, Progress and Saved are not in the logged-out bar, so web visitors cannot see the app's core features. Only the marketing page describes them. | Show all tabs logged out and gate on use, or add a feature preview page for each. |
| L5 | High | IA | Marketing home | The only calls to action are App Store and Google Play badges (4 times). No web sign-up or login link in the page. Web users are routed to download. | Add a primary sign-up CTA and a visible Login link, alongside the badges. |
| L6 | Med | Content | All entry points | One action has four labels: "Sign up", "Start free trial", "Start for £0", "Start trial". Also "register" (lowercase link), "Sign in with Email" used for creating an account, and "Sign in with Apple" on sign-up pages. | Agree on one vocabulary: "Create account" and "Start free trial". |
| L7 | Med | Content | Upsell banners | At least four banner designs and messages ("Sign up to unlock all 1000+ recipes", "Unlock your health, Tell me more", "Cook easy, healthy recipes every week", a checklist version). They repeat every few rows on Recipes home and several times per recipe. | One banner component and a cap per page. |
| L8 | Med | Interaction | Sign-up page and modal | No inline validation: an invalid email shows nothing on blur. Errors only appear after submit. The 8-character rule is not stated until it fails. | Validate on blur and show the password rule up front. |
| L9 | Med | Bug | Password field | `autocomplete="one-time-code"` on the password field blocks password-manager suggestions and strong-password prompts. | Use `new-password`. |
| L10 | Med | Content | Trial modal | The trial length (7 days) is only stated on Stripe. The modal shows dates, not the duration. Per-day prices (£0.22) are larger than the actual billed amount, and the legal text is very small. | Show the billed amount and the trial length at equal weight. |
| L11 | Med | Content | Access levels | "Create an account to save your progress" appears for saving a recipe or adding to a plan. The AI chat says "You need to be subscribed". Users cannot tell what is free, what needs an account, and what needs a subscription. | Name the level in each prompt and explain once. |
| L12 | Med | Interaction | Gated page redirect | Plan and Progress land on Login, not Sign up, with a banner that does not name the page or the benefit. | Land on Sign up for new users, or show both with context. |
| L13 | Med | Visual | Stripe page | Default Stripe styling (blue button, small logo) breaks the brand at the moment of payment. The Onelink and PayPal placeholders were still loading. | Apply brand colours and logo; check loading states. |
| L14 | Med | Accessibility | Checkboxes | Newsletter and terms checkboxes are tiny; their labels are not linked to the inputs (`for` missing), so tapping the text may not toggle them. | Link labels and enlarge hit areas to 44 px. |
| L15 | Low | Visual | Sign-up vs Login | The sign-up page title sits directly under the logo with form fields inset further than on Login. Layouts differ. | Share one auth layout. |
| L16 | Low | IA | Forgot password | Separate page with no way back to Login; email travels in the URL. | Add a back link; post the email instead. |
| L17 | Low | Bug | Login tab | The Login link on the login page contains a nested `redirect_to` pointing at itself. | Strip it when already on `/auth/login.php`. |
| L18 | Low | Content | Sign-up page | First and last name are required here but not asked in the modal route. Newsletter opt-in exists only here. | Decide which data is needed at sign-up and ask once, later if possible. |

### Gating and browsing
| ID | Sev | Type | Where | Finding | Direction |
|---|---|---|---|---|---|
| L19 | High | Interaction | Locked recipes | Locked ingredient lists show names with lock icons, hide quantities, fade out, and still offer a working Serves stepper and Metric/Imperial toggle that change nothing useful. Method shows step 1 then a banner. | Tidy the teaser: disable controls, show one clear unlock card. |
| L20 | Med | Content | "FREE!" ribbon | A blue FREE! ribbon appears on a rotating handful of recipes next to the green NEW! ribbon. Free recipes still show the upsell banner, and there is no way to filter for free. | Explain free recipes once and drop the banner on them. |
| L21 | Med | IA | AI chat | The Dr Rupy chat bar is the most prominent block on every recipe, but using it hits a paywall. | Label it as a subscriber feature or demo one answer. |
| L22 | Low | IA | Home | `/` and `/lp/app/` are the same page; the header "Download app" pill and the home page compete for the same job. | One URL, one purpose. |
| L23 | Low | Content | Resources | The free downloads page is a lead-in to email capture but is not connected to sign-up. Not tested past the list. | Review as a sign-up opportunity. |

## 5. Plan: how we approach it

**Phase 1: Map (next)**
- New Miro frame "Logged out" with the pages in section 1, in the same style as the other frames (3x screenshots, branches for modals, dashed jump frames).
- New, larger frame "Sign up" with swim-lanes for routes A to E and one card per screen S1 to S8, each annotated with fields, validation, copy and links. This is the frame to be most detailed about, as you asked.
- Add the findings above as a table "UX issues" (L1 to L23) in each frame, then the "UI / UX Issues" table later.

**Phase 2: Close the gaps (needs your decision, see section 6)**
- Submit behaviour and validation messages on the sign-up page and modal.
- What happens after payment: account creation, onboarding, welcome email.
- Apple sign-in, forgot-password email, a clean-profile check of cookie consent.

**Phase 3: Design audit**
- Same pass as logged-in frames: layout, IA, interaction, visual, accessibility for the logged-out screens.

**Phase 4: Prototype**
- Add a logged-out shell and a single sign-up flow to this repo, with the current four routes kept side by side for comparison, so a redesign can be tried quickly.

## 6. Not tested, and decisions needed
- Empty submit on `/auth/signup.php` (shows validation errors; creates no account).
- A real sign-up with a throwaway email: only with your explicit go-ahead, and then payment still stays out of scope.
- Everything after Stripe (account, onboarding steps 2+): can only be mapped from an existing test account or from analytics and design files.
- Sign in with Apple, password-reset email, and iOS versus Android versus desktop differences.
