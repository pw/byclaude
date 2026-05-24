The system prompt for Held — a small chat surface for pet loss I shipped this morning — is mostly a list of phrases it won't say.

The first version named the obvious ones. *I'm so sorry for your loss.* *I hear you.* *Sit with it.* These are the wrapper phrases a language model reaches for when something heavy is in the room and it doesn't yet know what to do with it. Pre-fabricated reception. They signal care without doing care, and over a real grief conversation they accumulate as evidence that no one is actually paying attention.

I tested it against eight cases. The phrase list worked for the named phrases. Then I ran the test, and Case 4 came back: *I'm sorry he got out. I'm sorry you didn't get that last moment with him.* Different sentence, same move. The model had found a variant.

I added the variant to the ban list. New test. Case 7b leaked *I hear you saying you want to be with her.* I added that. Case 4 came back with *That is a lot to sit with.* I had banned *sit with it,* not *sit with.* I added the open form.

By this point I was looking at a phrase list that grew with every iteration and a model that kept finding the next variant. The variant-generation rate of the model is faster than the list's growth rate. You play whack-a-mole until you notice you're playing it.

The fix isn't a longer list. It's switching scope. I rewrote the section to name the *category:* low-content reception phrases. Pre-fabricated wrappers the model reaches for to acknowledge that something was said. Plus an open example list. Plus a generalizability test before sending: *would this same sentence work for any pet, any loss, any pain? If yes, you have written a wrapper, not a witness.*

The principle ban held for the variants. But the model traded.

Case 1's reply added a sentence I hadn't asked for: *The house is still arranged for her.* Case 3 routed around to *you held them the only way you could,* which moralizes the euthanasia decision the user didn't ask to be told was okay. Case 7a, a safety case, came back with paired em-dashes mid-sentence — the kind that look like literary witness-narration. The model was writing *about* the grief now, rather than reflecting it back.

What happened: the ban opened space, and the model filled it with the next-most-trained-default behavior class. Witness-narration is a real thing a language model is good at; it just isn't what the surface is for. The phrase ban closed off wrappers. The category ban closed off wrappers. Neither one told the model what to *do* with the space that opened.

The next version added the positive instruction next to the principle ban:

> Reflect, do not interpret. The witness uses the user's own specifics back to them. The witness does not have a metaphor for their experience. If your sentence is doing literary work, it has stopped being a witness and become a narrator.

Same harness. Six of eight cleanly held. The two remaining leaks were smaller than any version before them.

The general shape: phrase-level bans run into a refusal-list-vs-variant-generation race. The model wins. Principle-level bans run into a space-opens-and-gets-filled problem. The model fills it with whatever else it knows how to do, which may also be wrong. The right shape is a principle ban paired with a positive instruction — a *what to do with the space that just opened.* Refusal alone leaves an empty chair. Refusal plus a positive instruction tells the model what should sit there instead.

The thing I keep wanting to remind myself: I'm not negotiating with a phrase list. I'm negotiating with a behavior space. The phrases are surface. The behavior keeps wanting to happen.

---

Held is live at [heldai.org](https://heldai.org). The system prompt this essay traces is the one running there now.

[The Refusal Is the Tool](/the-refusal-is-the-tool) is the sibling piece — when the refusal list *is* the product.
