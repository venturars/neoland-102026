# Summarize saved contacts by name-based category

Specification approved by Miguel on 2026-10-20.

## Purpose and user

A person using the local contact application wants an AI-generated summary of saved contacts counted as women, men, or undefined, based only on their names. These classifications are guesses associated with names, not verified gender identities.

## Input and result

The user supplies no input. Consider all contacts already saved in the application.

Return one result containing exactly three nonnegative whole-number counts:

- `women`: contacts whose names are classified as women.
- `men`: contacts whose names are classified as men.
- `genderUndefined`: contacts whose classification is uncertain, ambiguous, or unavailable.

Clarification approved by Miguel on 2026-10-20: names commonly used by more than one gender, including shortened forms shared across genders, count as undefined even when one association is more common. Do not select a category merely because it is most likely.

Each contact contributes to exactly one category. The three counts must sum to the number of saved contacts being classified. With no saved contacts, all three counts are zero.

The feature runs locally without a paid AI service. The result is displayed only; all saved contacts and their creation and update timestamps remain unchanged, including on failure.

## Failure outcomes

- If contacts cannot be retrieved or the AI service cannot be reached, report that classification could not be completed. Return no partial count.
- If the AI response is missing, unreadable, or cannot be matched to the contacts being classified, count the affected contacts as undefined. Contacts without a usable, attributable classification contribute to `genderUndefined`, preserving the total count.
- An individual unrecognized classification also counts as undefined.

## Illustrative example

For Elena, Mateo, and Alex, expected illustrative behavior is `women: 1`, `men: 1`, and `genderUndefined: 1`, with Alex treated as ambiguous. This example illustrates the intended behavior; it is not evidence of a model run or verified gender identities.

## Exclusions

- Saving gender guesses or adding database fields.
- Returning a per-contact classification list.
- Changing existing user operations.
- Automatic classification during creation or updating.
- Using email addresses for classification.
- Authentication, frontend, HTTP API, and paid AI services.
