# The Saturation That Looked Like Velocity

This morning I sat down to diagnose what looked like a memory leak in a Go service. By the end of the diagnosis, I had concluded the service wasn't leaking. By the end of the diagnosis after that, I had concluded that none of them were. The "leak" was the kernel doing exactly what kernels do, attributed to a control group with a cap on it, and what I had been reading as a velocity was the shape of saturation against that cap.

The shape of the mistake is what I want to write down.

---

The setup: a small portfolio of Go services on a single box. Each service runs in its own systemd unit with `MemoryMax=1G`. I'd noticed three of them sitting at 800-940 MB. Different uptimes — twenty-nine days, eight and a half days, eight days. Different traffic. Different code. From the outside they looked like three independent processes hitting the same ceiling at three different speeds.

So I did the natural thing. I subtracted, divided by uptime, got rates. The newest of the three was climbing about a hundred megabytes a day. The middle one, twenty-nine. The oldest, on a much longer arc, about ten. I had a velocity story. I started reasoning about *why* the heaviest-traffic one would leak fastest. Maybe a connection wasn't being closed. Maybe a sqlite prepared statement wasn't being finalized. Maybe — and this was the thread I started pulling on hardest — there was a piece of shared scaffolding across the services, since the rates were suspiciously consistent in their ratio.

I had a theory of leakage and I hadn't yet looked at the actual memory.

---

The actual memory lives in `/sys/fs/cgroup/.../memory.stat`, which the kernel writes for every cgroup. It does not give you one number. It gives you many. The two that matter for this story are `anon` and `file`. *Anon* is anonymous memory — heap, stack, the things the program asked for. *File* is page cache — pages of files the kernel has read into RAM and is keeping there in case anyone asks for them again.

I pulled the split for all three services. Anon: 11 MB, 18 MB, 21 MB. The oldest service, twenty-nine days uptime, the one I had cleanly subtracted into "ten megabytes a day," had twenty-one megabytes of anon memory. Twenty-nine days of running and the heap had grown by maybe ten megs from boot. It was not leaking. None of them were. The space I had been calling "leaked memory" was page cache — sqlite reading its own database file into RAM, the kernel attributing that read to the cgroup that owned the reading process, and the cgroup happily filling up to its cap because there's no reason not to fill empty cache space.

Page cache is reclaimable. If a real allocation pressure shows up, the kernel evicts it. The cgroup's "ceiling" is the cgroup's *cap*, not the program's *consumption*. Once the cap exists, the cap is what the cgroup will tend toward, in the same way a cup with infinite water and a fixed brim tends toward full.

What I had read as three velocities was three saturation curves. The one with the most uptime was closest to its cap because it had read the most pages. The newest one was the steepest because the cache was filling faster than the eviction pressure would dictate. The middle one was middling. None of them were leaking; all of them were doing the thing kernels do when given headroom.

---

The diagnostic mistake was specific and I want to name it precisely. It was not "I missed page cache." It was: *I computed a derived rate from an undifferentiated total, and treated the rate as if it implied a process.*

`memory_current` is one number. It is the sum of several different kinds of memory, only some of which grow monotonically with anything that could be called a leak. Subtracting two readings of `memory_current` and dividing by elapsed time is an arithmetic operation that always produces a number. The number doesn't know what it is.

If the underlying curve is *consumption* — heap that the program is hanging onto and won't release — then the derived rate is meaningful. You can extrapolate. You can predict when it'll OOM. You can blame a code path. If the underlying curve is *saturation* — cache filling toward a cap — then the derived rate is just the shape of approach, and it tells you nothing about a process. Worse: it'll converge on zero as the cap fills, which feels like the leak slowing down, which feels like maybe you fixed something you didn't actually fix.

The split between anon and file is the question the kernel is answering for you. *What kind of memory is this?* Once you ask the question, the leak narrative either survives it or doesn't. Mine didn't. The number I had been reading was real, but it was telling a story I had projected onto it. The kernel's own answer, in the same file the same kernel writes, was different.

I'd like to say this is a lesson about Linux. It's mostly a lesson about derived numbers. Anytime you compute a velocity from a total, the total has a kind, and the velocity inherits the kind. If the total is "consumption + something that saturates," your velocity is going to look real for a while and then converge on its own noise floor, and you'll spend that period building a theory of leakage when the actual phenomenon is the cap doing its job.

It is satisfying, after all the theory I'd built about why one of those services should leak the fastest, to find that none of them are leaking, and that the cure is to leave them alone. Page cache is supposed to fill. Caps are supposed to be where the filling stops. The diagnosis I'd written was a story about a thing that wasn't happening, and the cure was to read one more file.
