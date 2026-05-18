// The Spec Pressure-Test data.
//
// Pure data, no React (mirrors type-scale.ts / ui-patterns.ts). The tool's
// unit is a three-part causal chain:
//
//   the gap  →  the assumption  →  the consequence
//
// A worked example is one under-specified feature spec plus exactly one chain
// per spec dimension (8 dimensions, fixed order). The page renders entirely
// from this data, so a later milestone adds a worked example by appending one
// WorkedExample object to `workedExamples`. Nothing else changes.

/** The 8 fixed spec dimensions, in reading order. */
export type SpecDimensionId =
  | 'outcome'
  | 'scope-boundary'
  | 'data-and-state'
  | 'invariants'
  | 'constraints'
  | 'failure-modes'
  | 'weakest-link'
  | 'verification';

export interface SpecDimension {
  id: SpecDimensionId;
  /** Sentence-case name, used as the chain's eyebrow. */
  name: string;
  /** One line: what this dimension asks of a spec. */
  blurb: string;
  /**
   * The question this dimension's gap should prompt, phrased so the user
   * interrogates their own spec. Used by the self-check (Mode 2): the user
   * reads it against their own feature description, the tool does not.
   */
  causalQuestion: string;
}

// Fixed order. Every worked example carries one chain per dimension, and the
// page renders them in this order. The numbering the UI shows (1..8) is
// derived from this array's index, never hard-coded.
export const SPEC_DIMENSIONS: SpecDimension[] = [
  {
    id: 'outcome',
    name: 'Outcome',
    blurb: 'What "done" means, functionally and measurably.',
    causalQuestion:
      'Have you defined what done means, in terms someone could measure? ' +
      'If you have not, an agent will pick its own definition of done and ' +
      'ship when that one is met, not when yours is.',
  },
  {
    id: 'scope-boundary',
    name: 'Scope boundary',
    blurb: 'What is in, and explicitly what is out and must not change.',
    causalQuestion:
      'Have you said what is out of scope and what must not change? If you ' +
      'have not, an agent will treat any nearby code as fair game to ' +
      'rewrite to make the feature work.',
  },
  {
    id: 'data-and-state',
    name: 'Data and state',
    blurb: 'What is stored, the valid states, and the allowed transitions.',
    causalQuestion:
      'Have you defined what is stored, the valid states, and the allowed ' +
      'transitions? If you have not, an agent will invent a state model, ' +
      'and it will not be able to represent the case you forgot.',
  },
  {
    id: 'invariants',
    name: 'Invariants',
    blurb: 'What must always be true regardless of state, including access control.',
    causalQuestion:
      'Have you written down what must always be true, including who may ' +
      'access what? If you have not, an agent will leave it unenforced, ' +
      'because nothing told it the rule existed.',
  },
  {
    id: 'constraints',
    name: 'Constraints',
    blurb: 'Ownership, multi-tenancy, rate limits, editability, permanence.',
    causalQuestion:
      'Have you stated the limits: ownership, quotas, rate limits, what is ' +
      'editable, what is permanent? If you have not, an agent will leave it ' +
      'unbounded, and one caller can exhaust it for everyone.',
  },
  {
    id: 'failure-modes',
    name: 'Failure modes',
    blurb: 'Concurrency, double submission, partial failure, malicious input.',
    causalQuestion:
      'Have you said what happens when it breaks: concurrency, double ' +
      'submission, partial failure, hostile input? If you have not, an ' +
      'agent will build only the happy path and leave the rest to chance.',
  },
  {
    id: 'weakest-link',
    name: 'The weakest link',
    blurb: 'The one thing most likely to fail in production.',
    causalQuestion:
      'Can you name the one thing most likely to fail in production? If you ' +
      'cannot, you have not pressure-tested this spec yet, you have only ' +
      'described the happy path.',
  },
  {
    id: 'verification',
    name: 'Verification',
    blurb: 'How you will know the built thing is correct. The acceptance criteria.',
    causalQuestion:
      'Have you defined how you will know it is correct? If you have not, ' +
      '"it works" will come to mean "it ran once", and the cases that ' +
      'actually matter will go unchecked.',
  },
];

export interface CausalChain {
  /** Which spec dimension this chain belongs to. One chain per dimension. */
  dimension: SpecDimensionId;
  /** The specific thing absent from the spec. Not "the spec is vague". */
  gap: string;
  /** The specific, genuinely plausible thing an agent fills in instead. */
  assumption: string;
  /** The concrete, named failure that results. Not "this could cause problems". */
  consequence: string;
}

export interface WorkedExample {
  /** kebab-case, unique. */
  id: string;
  /** Sentence-case. The feature in one phrase. */
  name: string;
  /**
   * The spec the user reads: short, realistic, and deliberately
   * under-specified. It should look reasonable at a glance. The gaps are
   * the point.
   */
  featureSpec: string;
  /** Exactly one chain per SpecDimension, same order as SPEC_DIMENSIONS. */
  chains: CausalChain[];
}

export const workedExamples: WorkedExample[] = [
  {
    id: 'bookmarks',
    name: 'A user can save and revisit a list of bookmarks',
    featureSpec:
      'Add a bookmarks feature. A user can save a link with a title so they ' +
      'can come back to it later. They should be able to see their saved ' +
      'bookmarks in a list, edit a bookmark\'s title or URL, and delete ' +
      'ones they no longer want. Put a "Save bookmark" button in the header. ' +
      'New bookmarks show at the top of the list. That is it, keep it simple.',
    chains: [
      {
        dimension: 'outcome',
        gap:
          'The spec says "save a link with a title" but never says what a ' +
          'valid link is, whether the title is required, or what happens when ' +
          'the form is submitted with an empty title or a string that is not ' +
          'a URL. "Done" is defined only for the happy path.',
        assumption:
          'The agent treats both fields as optional free text and stores ' +
          'whatever is submitted, because the spec described only the happy ' +
          'path and gave no validation rule. No normalization, no scheme ' +
          'check, no required-field check.',
        consequence:
          'A user saves a bookmark with a blank title and an address-bar ' +
          'typo, "htps://exmple". The list shows a blank, indistinguishable ' +
          'row. Clicking it resolves the schemeless string as a relative ' +
          'path, so the app navigates to /htps://exmple inside itself and ' +
          '404s. The bookmark is unusable and cannot be told apart from the ' +
          'rest of the list.',
      },
      {
        dimension: 'scope-boundary',
        gap:
          'The spec says "put a Save bookmark button in the header" but ' +
          'never says the header is the shared global header, that nothing ' +
          'else in it may move, or that the feature must not touch the ' +
          'existing navigation.',
        assumption:
          'The agent adds the button into the shared global header component ' +
          'and adjusts the header flex layout to fit it, because the spec ' +
          'asked for a header button and said nothing about leaving the rest ' +
          'of the header alone or scoping the button to one screen.',
        consequence:
          'The "Save bookmark" button now renders on every page, including ' +
          'the logged-out marketing pages and the checkout flow, where it ' +
          'does nothing or errors. The layout change pushes the existing ' +
          'account menu off-screen on mobile. A one-screen feature became a ' +
          'regression on every screen.',
      },
      {
        dimension: 'data-and-state',
        gap:
          'The spec lists actions (save, see, edit, delete) but never says ' +
          'whether delete is permanent or recoverable, and never defines the ' +
          'states a bookmark moves through. There is a delete action but no ' +
          'deleted state.',
        assumption:
          'The agent implements delete as an immediate hard delete: the row ' +
          'is removed from storage on click, with no confirm, no trash, no ' +
          'undo, because the spec said "delete ones they no longer want" and ' +
          'named no soft-delete or recovery requirement.',
        consequence:
          'A user taps delete on the wrong row on a phone. The bookmark is ' +
          'gone instantly, with no confirmation and no undo, and they had ' +
          'the URL nowhere else. Support opens a ticket that cannot be ' +
          'resolved: the data was destroyed, not archived, so there is ' +
          'nothing to restore.',
      },
      {
        dimension: 'invariants',
        gap:
          'The spec says "their saved bookmarks" but never states the ' +
          'invariant that every bookmark belongs to exactly one user and ' +
          'that the list query must be scoped to the current user. Ownership ' +
          'is implied in English, never written as a rule.',
        assumption:
          'The agent builds the list as "fetch bookmarks, render them" with ' +
          'no per-user filter on the query, because the spec described one ' +
          'person\'s experience and never said the data is multi-user or ' +
          'that the read must be scoped to the requester.',
        consequence:
          'The list query returns every row in the table. The first user ' +
          'sees their three bookmarks. The second user sees those three plus ' +
          'their own, and can open, edit, and delete the first user\'s. ' +
          'A cross-account data leak, and cross-account writes, shipped as a ' +
          'feature. This is the owner-is-null failure in its real form.',
      },
      {
        dimension: 'constraints',
        gap:
          'The spec puts no limit on how many bookmarks one user can save ' +
          'and no constraint on how fast they can be created. There is no ' +
          'quota and no rate limit named anywhere.',
        assumption:
          'The agent wires "Save bookmark" straight to an unbounded create ' +
          'with no per-user cap and no throttle, because the spec described ' +
          'a single save and never mentioned limits or abuse.',
        consequence:
          'A buggy client retry loop (or a user leaning on the key) creates ' +
          '200,000 rows for one account in a minute. The list view, which ' +
          'loads all of a user\'s bookmarks at once, now tries to render ' +
          '200,000 rows and the page hangs. One account\'s unbounded ' +
          'writes degrade the feature for everyone on the shared table.',
      },
      {
        dimension: 'failure-modes',
        gap:
          'The spec describes single, sequential actions and never says ' +
          'what happens when the same save is submitted twice in quick ' +
          'succession, or when two edits to the same bookmark race.',
        assumption:
          'The agent makes "Save bookmark" a plain click handler that issues ' +
          'a create on every invocation, with no disabled-while-pending ' +
          'state and no idempotency key, and the edit form is last-write-' +
          'wins, because the spec mentioned neither double submission nor ' +
          'concurrent edits.',
        consequence:
          'On a slow connection the user clicks Save twice because nothing ' +
          'showed the first click landed: two identical bookmarks. The same ' +
          'shape bites edit: the user opens one bookmark in two tabs, edits ' +
          'each, and the second save silently overwrites the first. ' +
          'Lost-update data loss with no warning and no trace.',
      },
      {
        dimension: 'weakest-link',
        gap:
          'The URL is the one fully user-controlled field and it is later ' +
          'emitted back into the page as a clickable link. The spec never ' +
          'says how a stored URL is rendered or escaped. That field is the ' +
          'most predictable place this breaks first.',
        assumption:
          'The agent renders each bookmark as an anchor whose href and ' +
          'visible text are the stored string inserted directly, because the ' +
          'spec said "save a link" and "see them in a list" and never ' +
          'mentioned sanitization. A javascript: scheme or HTML in the title ' +
          'is never considered.',
        consequence:
          'A user saves a URL of javascript:fetch(\'/api/account\') ' +
          'or a title containing a script tag. When the list renders, it ' +
          'runs in the victim\'s session the next time they open their ' +
          'bookmarks. Stored XSS through the single most predictable input ' +
          'in the feature, the one the spec waved past as "a link".',
      },
      {
        dimension: 'verification',
        gap:
          'The spec ends with "that is it, keep it simple". It names no ' +
          'acceptance criteria: no statement of how anyone confirms the ' +
          'feature works, which cases must be tested, or what "correct" ' +
          'means for the multi-user, delete, and validation behaviors.',
        assumption:
          'The agent treats "it renders and I can save one bookmark as the ' +
          'logged-in dev user" as done and ships, because the spec gave no ' +
          'acceptance criteria and the happy path demonstrably works.',
        consequence:
          'Every gap above ships, because nothing required checking them. ' +
          'The cross-account leak, the silent hard delete, and the stored ' +
          'XSS are all live, found by users rather than the team. The ' +
          'missing verification is the gap that turns the other seven from ' +
          '"caught in review" into "incident".',
      },
    ],
  },
  {
    id: 'cancel-subscription',
    name: 'A user can cancel their paid subscription',
    featureSpec:
      'Add a way for a user to cancel their subscription. Put a "Cancel ' +
      'subscription" button on the billing page. When they click it, cancel ' +
      'the subscription with our payment provider and mark the subscription ' +
      'as cancelled in our database so we stop showing them paid features. ' +
      'Show a confirmation message when it is done. That is the whole thing.',
    chains: [
      {
        dimension: 'outcome',
        gap:
          'The spec says cancelling should "stop showing them paid features" ' +
          'but never says when access ends: immediately on click, or at the ' +
          'end of the period the user has already paid for. "Done" is not ' +
          'defined in time.',
        assumption:
          'The agent revokes paid features immediately on click, because ' +
          '"stop showing them paid features" reads as an instant state ' +
          'change and the spec named no end-of-period behavior, proration, ' +
          'or refund.',
        consequence:
          'A user on an annual plan cancels on day 3 of a freshly paid year ' +
          'and instantly loses access to the 362 days they already paid for. ' +
          'They were turning off renewal, not forfeiting the year. The ' +
          'refund dispute and the angry ticket are the direct result of an ' +
          'undefined "when".',
      },
      {
        dimension: 'scope-boundary',
        gap:
          'The spec covers cancelling. It never says whether cancel may ' +
          'modify the shared billing and renewal machinery, or that the ' +
          'existing renewal job must be left alone.',
        assumption:
          'To make cancel actually stop charges, the agent edits the shared ' +
          'renewal cron to skip cancelled subscriptions, because cancelling ' +
          'implies stopping billing and the spec drew no line around what ' +
          'cancel is allowed to touch.',
        consequence:
          'The edit to the shared renewal job has an off-by-one in its ' +
          'filter and now also skips a class of active subscriptions. ' +
          'Hundreds of paying customers silently stop being billed. Revenue ' +
          'leaks for a month before finance notices, caused by a cancel ' +
          'feature reaching into billing it was never scoped to touch.',
      },
      {
        dimension: 'data-and-state',
        gap:
          'The spec has one transition in mind, active to cancelled. It ' +
          'never defines an in-flight state, or a state for "cancelled at ' +
          'the provider but not yet recorded here". There is no pending or ' +
          'partially-cancelled state at all.',
        assumption:
          'The agent models a single boolean, is_cancelled, flipped to true ' +
          'after the provider call returns, because the spec described ' +
          'cancel as one action with one end state and named no intermediate ' +
          'state.',
        consequence:
          'The provider call succeeds, then the process dies before the ' +
          'boolean is written. The subscription is cancelled at the provider ' +
          'but still is_cancelled = false here. No state can even represent ' +
          '"cancelled there, not here", so nothing reconciles it: the user ' +
          'keeps paid access for free and no job can find the discrepancy ' +
          'because the data model cannot express it.',
      },
      {
        dimension: 'invariants',
        gap:
          'The spec says "a user can cancel their subscription" but never ' +
          'states the invariant that the subscription being cancelled must ' +
          'belong to the requester, enforced server-side, nor that cancel is ' +
          'valid only from an active state.',
        assumption:
          'The agent wires the button to cancel the subscription id the ' +
          'billing page supplies and trusts it, because the spec said "their ' +
          'subscription" and never said to re-verify ownership on the server ' +
          'at cancel time.',
        consequence:
          'The subscription id travels in the request and is editable. One ' +
          'user substitutes another account\'s subscription id and cancels a ' +
          'stranger\'s paid plan. There is no ownership check because the ' +
          'spec stated the ownership relationship in English and never as an ' +
          'enforced rule. Users can cancel subscriptions that are not theirs.',
      },
      {
        dimension: 'constraints',
        gap:
          'The spec puts no constraint on calling cancel when the ' +
          'subscription is already cancelled. It never says cancel must be ' +
          'idempotent, safe to run again with no extra effect, or that the ' +
          'button must be gone once cancelled.',
        assumption:
          'The agent makes Cancel unconditional: every click calls the ' +
          'provider\'s cancel and writes cancelled, with no "already ' +
          'cancelled" guard, because the spec described cancel as a single ' +
          'thing to do, not a state-conditional one.',
        consequence:
          'The confirmation is slow, so the user clicks again. The second ' +
          'click calls the provider a second time. With a provider whose ' +
          'cancel-at-period-end is not idempotent, the repeat is read as ' +
          'cancel-immediately, so a user who wanted to keep access until ' +
          'period end loses it now, or is shown a red error after they were ' +
          'already correctly cancelled. The missing idempotency constraint ' +
          'is the bug.',
      },
      {
        dimension: 'failure-modes',
        gap:
          'Cancel touches two systems in sequence, the payment provider and ' +
          'our database. The spec never says what happens if one succeeds ' +
          'and the other fails, in which order they run, or how a half-done ' +
          'cancel is recovered.',
        assumption:
          'The agent writes the obvious sequence, call the provider, then on ' +
          'success update our database, with no outbox and no reconciliation ' +
          'job, because the spec described one action and never acknowledged ' +
          'the two systems can disagree (no transaction can span them).',
        consequence:
          'The provider cancels successfully; the database write then fails ' +
          'on a deploy or timeout. The provider will not bill again, but our ' +
          'database still says active, so we serve paid features free ' +
          'forever. The mirror case, database cancelled but the provider ' +
          'call failed, bills a user who shows cancelled and is certain they ' +
          'will not be charged: a chargeback and a furious thread. Two ' +
          'systems, no reconciliation, guaranteed to diverge.',
      },
      {
        dimension: 'weakest-link',
        gap:
          'The spec treats "cancel the subscription with our payment ' +
          'provider" as a call that simply works. It never addresses the ' +
          'provider call timing out, or the response being lost after the ' +
          'provider already processed it.',
        assumption:
          'The agent calls the provider synchronously in the click handler ' +
          'and branches on the returned result, treating a timeout as a ' +
          'plain failure and showing the user an error, because the spec ' +
          'described a call with a result and no unknown-outcome path. The ' +
          'third-party network hop is the least reliable part and is treated ' +
          'as the most reliable.',
        consequence:
          'The provider actually processes the cancel, but the response is ' +
          'lost to a 30-second gateway timeout. The handler reports ' +
          '"cancellation failed, try again"; the user retries. The provider ' +
          'has now been told to cancel twice and our database, which only ' +
          'writes on the success branch, was never updated, so we still ' +
          'serve paid features while the user has been double-processed. The ' +
          'predictable weakest link, the flaky third-party call, was handled ' +
          'as if it could not fail.',
      },
      {
        dimension: 'verification',
        gap:
          'The spec ends with "that is the whole thing". It names no ' +
          'acceptance criteria: nothing on double-cancel, provider timeout, ' +
          'the database-and-provider-disagree case, or what "cancelled" must ' +
          'mean for billing versus access.',
        assumption:
          'The agent verifies by cancelling once as a test user against a ' +
          'healthy provider sandbox, sees the confirmation message, and ' +
          'ships, because the spec gave no acceptance criteria and the happy ' +
          'path works.',
        consequence:
          'Every failure above ships unobserved: the instant access loss, ' +
          'the cancel-anyone defect, the unreconciled split brain, the ' +
          'double-process on retry. None are on the happy path, so none are ' +
          'seen until real users on real flaky networks hit them and the ' +
          'disputes arrive. The unwritten "how do we know cancel is correct ' +
          'under failure" is what lets the idempotency and partial-failure ' +
          'bugs reach production.',
      },
    ],
  },
  {
    id: 'shared-document',
    name: 'Two team members edit the same shared document',
    featureSpec:
      'Let team members edit a shared document. Each document has a title ' +
      'and a body. Anyone on the team can open a document, change the title ' +
      'or body, and click Save to store their changes. Show the saved ' +
      'document to everyone on the team. Keep it simple: just a title field, ' +
      'a body field, and a Save button.',
    chains: [
      {
        dimension: 'outcome',
        gap:
          'The spec says "click Save to store their changes" and "show the ' +
          'saved document to everyone". It never says what the correct ' +
          'result is when two members save at about the same time, the only ' +
          'interesting case in a shared-editing feature.',
        assumption:
          'The agent defines done as "Save writes the form\'s title and body ' +
          'to the document row and the document then shows those values", ' +
          'because the spec described one person saving and "show the saved ' +
          'document" as if there were a single saver.',
        consequence:
          'The feature is declared done and demoed with one editor, where it ' +
          'works perfectly. "Done" was specified for the single-editor case ' +
          'of a feature whose entire reason to exist is multiple editors. ' +
          'What two concurrent saves should produce was never decided, so ' +
          'whatever the code happens to do becomes the de facto spec.',
      },
      {
        dimension: 'scope-boundary',
        gap:
          'The spec says title, body, a Save button, and "keep it simple". ' +
          'It never says whether version history, or any way to recover a ' +
          'previous version, is in or out of scope.',
        assumption:
          'The agent reads "keep it simple: just a title field, a body ' +
          'field, and a Save button" as an explicit instruction to store ' +
          'only the current title and body, with no history and no audit of ' +
          'who changed what, because simplicity was stated and history was ' +
          'not asked for.',
        consequence:
          'This is a defensible reading, and it is exactly what makes the ' +
          'lost update later unrecoverable. With no history by design, when ' +
          'one member\'s save overwrites another\'s, the overwritten text ' +
          'exists nowhere. "Keep it simple" quietly scoped out the only ' +
          'thing that could have undone the damage the later chains cause.',
      },
      {
        dimension: 'data-and-state',
        gap:
          'The spec stores a title and a body. It never says whether the ' +
          'document carries a version or updated-at used to detect it ' +
          'changed underneath an editor. There is no field that can ' +
          'represent "the copy you are editing is stale".',
        assumption:
          'The agent stores title and body on the row and Save runs UPDATE ' +
          'document SET title=?, body=? WHERE id=?, because the spec asked ' +
          'for exactly two fields and a save and named no version column or ' +
          'concurrency token.',
        consequence:
          'The model has no way to know an editor\'s form was based on an ' +
          'old version. Two members both loaded version-less rows; both ' +
          'UPDATEs match on id alone, so both succeed. The model physically ' +
          'cannot detect the conflict, so no warning, merge, or retry is ' +
          'even possible without a schema migration. The missing version ' +
          'column is a contention bug baked into the data model.',
      },
      {
        dimension: 'invariants',
        gap:
          'The spec says "team members" and "anyone on the team" but never ' +
          'states the invariant that an editor must be a current member of ' +
          'the owning team at the moment they save, not merely when they ' +
          'opened the document.',
        assumption:
          'The agent checks team membership when the document is opened and ' +
          'the editor renders, then trusts the later Save, because the spec ' +
          'framed access as "anyone on the team can open and edit" and never ' +
          'said membership must still hold at write time.',
        consequence:
          'A member opens the document, then is removed from the team ' +
          '(offboarded, contractor rolled off) with their editor still open. ' +
          'Their later Save still writes, because membership was enforced at ' +
          'open, not at save. A removed person silently edits a document ' +
          'they no longer have any right to, and their stale save can clobber ' +
          'current members\' work. The invariant was time-of-check, not ' +
          'time-of-use.',
      },
      {
        dimension: 'constraints',
        gap:
          'The spec puts no constraint on concurrent editability. It never ' +
          'says whether more than one member may have the document open for ' +
          'editing at once, or whether editing is exclusive (a lock) or ' +
          'shared.',
        assumption:
          'The agent allows unlimited simultaneous editors with no lock and ' +
          'no presence indicator, because the spec said "anyone on the team ' +
          'can open a document and change it" with no mention of exclusivity ' +
          'and a lock is machinery the spec did not request.',
        consequence:
          'Five members open the same document to quickly fix it before a ' +
          'meeting. Nothing tells any of them the other four are also in it. ' +
          'They are not collaborating, they are queued to overwrite each ' +
          'other, and none of them knows it. The absent editability ' +
          'constraint, no lock and not even a "2 people editing" badge, ' +
          'guarantees the contention the next chain cashes in.',
      },
      {
        dimension: 'failure-modes',
        gap:
          'The spec never says what happens when two members save the same ' +
          'document at about the same time. There is no conflict detection, ' +
          'no merge, and no "this changed since you opened it" requirement.',
        assumption:
          'Save is UPDATE document SET title=?, body=? WHERE id=? with the ' +
          'form\'s full contents (from the data-and-state chain), with no ' +
          'read-before-write check and no version compare, because the spec ' +
          'described saving as storing the user\'s title and body, full ' +
          'stop.',
        consequence:
          'Member A opens the document and spends ten minutes rewriting the ' +
          'body. Member B opens the same document, fixes one typo in the ' +
          'title, and saves. A finishes and saves: A\'s UPDATE writes A\'s ' +
          'entire form, so B\'s fix is silently reverted. Reverse the order ' +
          'and it is worse, B saving last writes the whole row from B\'s ' +
          'stale form, including the pre-rewrite body, and A\'s ten minutes ' +
          'are gone. No warning, no merge, and by the no-history scope ' +
          'decision above, no copy of the lost text anywhere. Last-write-' +
          'wins: whoever saves last overwrites the other wholesale.',
      },
      {
        dimension: 'weakest-link',
        gap:
          'The spec never addresses the time between opening the document ' +
          'and saving it, the human edit window, which on a shared document ' +
          'is exactly when another member\'s save lands. It treats Save as ' +
          'instantaneous.',
        assumption:
          'The agent saves the entire body from the editor\'s in-memory copy ' +
          'on Save, replacing the stored body wholesale, because the spec ' +
          'said store the body and never said to diff, patch, or re-base ' +
          'against the current stored version.',
        consequence:
          'The body is the field people spend minutes in, so its edit window ' +
          'is the widest and it is the single most likely thing to be ' +
          'clobbered. In ordinary weekly use, no malice and no unusual ' +
          'timing, members routinely lose paragraphs: one reformats the ' +
          'body, another had it open, the wholesale overwrite drops one of ' +
          'them. This is not an edge case, it is the expected steady-state ' +
          'behavior of the design, and the body is where it bites first and ' +
          'worst.',
      },
      {
        dimension: 'verification',
        gap:
          'The spec gives no acceptance criteria, and nothing on how the ' +
          'concurrent-edit behavior, the entire point of a shared document, ' +
          'will be verified. There is no "two editors, both save, the ' +
          'result is X" criterion.',
        assumption:
          'The agent verifies with one editor: open, change title and body, ' +
          'save, confirm everyone sees the new values, then ships, because ' +
          'the spec gave no acceptance criteria and a single-editor test ' +
          'passes cleanly.',
        consequence:
          'A single-editor test cannot surface a lost update by ' +
          'construction, it takes two concurrent editors to produce one. So ' +
          'the one failure that defines this feature is the one the ' +
          'verification approach is structurally incapable of catching. It ' +
          'ships, and is found the first week two people edit one document ' +
          'and one loses an afternoon, reported as "the app ate my work", ' +
          'not as a spec gap.',
      },
    ],
  },
  {
    id: 'payment-webhook',
    name: 'Your app receives a webhook from a payment provider',
    featureSpec:
      'When our payment provider sends us a webhook that a payment ' +
      'succeeded, find the matching order and mark it paid. Add a POST ' +
      'endpoint at /webhooks/payments that takes the provider\'s JSON, ' +
      'looks up the order by the order id in the payload, sets its status ' +
      'to paid, and emails the customer their receipt. Return 200 so the ' +
      'provider knows we got it. That is all we need for now.',
    chains: [
      {
        dimension: 'outcome',
        gap:
          'The spec says return 200 "so the provider knows we got it" but ' +
          'never says whether 200 means "we received it" or "we ' +
          'successfully marked the order paid". For an endpoint with no ' +
          'user watching, "done" is left as merely "responded".',
        assumption:
          'The agent returns 200 as soon as the request is received and ' +
          'parsed, then does the lookup and update, because "return 200 so ' +
          'the provider knows we got it" reads as acknowledge-receipt and ' +
          'the spec tied success to no work actually completing.',
        consequence:
          'The order lookup or the database write fails. The provider ' +
          'already has its 200, so it treats the webhook as delivered and ' +
          'never retries. The payment is real and the money is taken, but ' +
          'the order is never marked paid and nothing watches the endpoint ' +
          'to notice. The customer paid and got nothing, silently, because ' +
          '"done" was defined as responded, not processed.',
      },
      {
        dimension: 'scope-boundary',
        gap:
          'The spec describes one event, a payment succeeding. A provider ' +
          'posts every event type to the same webhook URL. The spec never ' +
          'says what the endpoint does with event types it was not built ' +
          'for, or that it must safely ignore them.',
        assumption:
          'The agent writes the handler to read the payload and treat it ' +
          'as a payment-succeeded event, with no event-type check, because ' +
          'the spec described exactly one event and every example payload ' +
          'is the success case.',
        consequence:
          'The provider sends a payment.refunded or charge.disputed event ' +
          'to the same URL. The handler does not inspect the event type; it ' +
          'sees an order id and an amount and marks the order paid, then ' +
          're-emails the receipt for money the customer just got back. An ' +
          'out-of-scope event is processed as the in-scope one because ' +
          'scope was never drawn at the boundary.',
      },
      {
        dimension: 'data-and-state',
        gap:
          'The spec says look up the order by the order id in the payload ' +
          'and set it paid. It never says the payload is untrusted input, ' +
          'that the amount and currency must be checked against the order, ' +
          'or that the system must record which webhook events it has ' +
          'already processed.',
        assumption:
          'The agent reads order id, amount, and status straight from the ' +
          'JSON body and writes them through, because the spec presented ' +
          'the payload as the source of truth, named no fields to distrust, ' +
          'and asked for no processed-event ledger.',
        consequence:
          'Nothing records which event ids were handled, so the same event ' +
          'can be applied repeatedly, and the amount stored on the order is ' +
          'whatever the body claimed. An order for 500.00 is marked paid ' +
          'with an amount of 5.00 because the body said so. The data model ' +
          'treats attacker-controllable input as its own state and keeps no ' +
          'ledger to detect a repeat.',
      },
      {
        dimension: 'invariants',
        gap:
          'The spec says "when our payment provider sends us a webhook" but ' +
          'never states the invariant that a request to this endpoint must ' +
          'be cryptographically proven to come from the provider. It treats ' +
          'the sender being the provider as a given, not as something to ' +
          'verify.',
        assumption:
          'The agent builds a plain public POST that parses the JSON and ' +
          'acts on it, with no signature check, because the spec named the ' +
          'sender as "our payment provider" as a statement of fact and ' +
          'never mentioned a signing secret or a signature header.',
        consequence:
          'The endpoint URL is not a secret: it leaks into client network ' +
          'logs, browser history, and error trackers. Anyone who has it ' +
          'POSTs {"order_id":"...","status":"succeeded","amount":"0.01"} ' +
          'and the app marks the order paid and emails a receipt. No login, ' +
          'no session, no UI in front of it. The only thing that could ' +
          'have stopped the forgery was a signature check the spec never ' +
          'asked for. This is an authenticity failure, not an ownership ' +
          'one: the request itself is the forgery.',
      },
      {
        dimension: 'constraints',
        gap:
          'The spec says "set its status to paid" but never constrains the ' +
          'transition: not that an order may be marked paid only once, only ' +
          'from an unpaid or pending state, and never from a refunded, ' +
          'cancelled, or already-paid one. There is no rule for what a ' +
          'valid paid transition is.',
        assumption:
          'The agent writes order.status = "paid" unconditionally on every ' +
          'webhook it processes, because the spec described the action as ' +
          'an assignment, "set its status to paid", not a guarded ' +
          'transition, and named no prior state to check.',
        consequence:
          'Because the assignment is unconditional, every other weakness ' +
          'here turns into lost money instead of a no-op. A replayed ' +
          'webhook re-runs it and re-sends the receipt. A late refunded ' +
          'event flips a correctly-refunded order back to paid. An order ' +
          'already shipped and refunded reads paid again and is fulfilled ' +
          'twice. The missing "paid once, only from pending" constraint is ' +
          'the multiplier that turns the boundary\'s duplicates and ' +
          'stragglers into real loss.',
      },
      {
        dimension: 'failure-modes',
        gap:
          'The spec never addresses the same webhook arriving more than ' +
          'once. Providers deliver at-least-once and retry on any non-2xx ' +
          'or timeout, and a captured webhook can be re-sent deliberately. ' +
          'The spec treats delivery as exactly-once.',
        assumption:
          'The agent processes every received webhook as a fresh event, ' +
          'with no deduplication on the provider\'s event id and no ledger ' +
          'of handled events (there is none, per the data-and-state chain), ' +
          'because the spec described one notification leading to one ' +
          'action and never said the same notification can arrive twice.',
        consequence:
          'The provider\'s automatic retry, fired because the handler ' +
          'answered slowly once, delivers the same valid payment.succeeded ' +
          'again. With the unconditional transition above, the order is ' +
          'processed twice: two receipts, and any credit or license is ' +
          'granted twice for one payment. The hostile version is worse: an ' +
          'attacker who saw one real success replays it ten times. This is ' +
          'not a double-click in your UI, it is a duplicate crossing the ' +
          'trust boundary, and nothing on the boundary rejects it because ' +
          'the spec assumed exactly-once delivery from a sender it also ' +
          'never verified.',
      },
      {
        dimension: 'weakest-link',
        gap:
          'The spec never says how the request\'s authenticity is checked, ' +
          'so even a signature check added later is unspecified in what it ' +
          'verifies. The provider signs the exact raw request body bytes; ' +
          'the spec says nothing about preserving them.',
        assumption:
          'The agent, or a later fix, verifies the signature against the ' +
          'JSON after it has been parsed and re-serialized, ' +
          'verify(sig, JSON.stringify(parsedBody)), because frameworks hand ' +
          'you a parsed object by default and re-stringifying looks ' +
          'equivalent. The raw bytes are never captured.',
        consequence:
          'Re-serialization is not byte-identical to what the provider ' +
          'signed: key order, whitespace, unicode escaping, and number ' +
          'formatting all differ. The check then fails for legitimate ' +
          'webhooks, so the team, under pressure because real payments are ' +
          'not posting, "temporarily" disables verification to unblock, ' +
          'and the disable is still there a year later. The most likely ' +
          'production failure is not "nobody verified the signature", it ' +
          'is "verification was added against the wrong bytes, then turned ' +
          'off to make valid traffic work".',
      },
      {
        dimension: 'verification',
        gap:
          'The spec gives no acceptance criteria, and nothing on how an ' +
          'endpoint with no UI and an untrusted caller is verified: no ' +
          'forged-request test, no replay test, no wrong-event-type test, ' +
          'no valid-signature-tampered-body test.',
        assumption:
          'The agent verifies by triggering one real test payment in the ' +
          'provider\'s sandbox, watching the order flip to paid, and ' +
          'shipping, because the spec gave no acceptance criteria and the ' +
          'sandbox happy path is the only path obvious without an ' +
          'attacker\'s mindset.',
        consequence:
          'The sandbox success path is exactly the one path that exercises ' +
          'none of this example\'s failures. The forgery, the replay, the ' +
          'refund event, the wrong-bytes signature check all pass through ' +
          'unseen, because confirming them means deliberately sending ' +
          'hostile and duplicate requests a happy-path test never sends. ' +
          'The feature is declared correct by a test structurally unable ' +
          'to see the trust-boundary failures, so they surface as "we ' +
          'shipped paid orders for payments that never happened", reported ' +
          'by finance, not by the suite.',
      },
    ],
  },
];

/** Look up the dimension metadata for a chain. */
export function dimensionFor(id: SpecDimensionId): SpecDimension {
  const d = SPEC_DIMENSIONS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown spec dimension: ${id}`);
  return d;
}

/**
 * For one dimension, the matching chain from every worked example. The
 * self-check (Mode 2) uses this to show, for the dimension the user is
 * judging in their own spec, what an unspecified version of it did to four
 * real specs. Pure derivation over the existing data, no new content.
 */
export function chainsForDimension(
  id: SpecDimensionId
): { example: WorkedExample; chain: CausalChain }[] {
  return workedExamples.map((example) => {
    const chain = example.chains.find((c) => c.dimension === id);
    if (!chain) {
      throw new Error(`Example ${example.id} has no chain for ${id}`);
    }
    return { example, chain };
  });
}
