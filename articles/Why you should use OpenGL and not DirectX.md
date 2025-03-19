---
layout: default
title: "Why you should use OpenGL and not DirectX"
---

# Why you should use OpenGL and not DirectX

[Source](http://blog.wolfire.com/2010/01/Why-you-should-use-OpenGL-and-not-DirectX)

[Translate](https://www.cnblogs.com/y114113/p/10676352.html)

January 8th, 2010
Often, when we meet other game developers and say that we use OpenGL for our game Overgrowth, we're met with stares of disbelief -- why would anyone use OpenGL? DirectX is the future. When we tell graphics card representatives that we use OpenGL, the temperature of the room drops by ten degrees.

This baffles us. It's common geek wisdom that standards-based websites, for instance, trounce Silverlight, Flash, or ActiveX. Cross-platform development is laudable and smart. No self-respecting geek enjoys dealing with closed-standard Word documents or Exchange servers. What kind of bizarro world is this where engineers are not only going crazy over Microsoft's latest proprietary API, but actively denouncing its open-standard competitor?
Before we dive into the story of why we support OpenGL, let's start with a bit of history:

## What is OpenGL?

In 1982, Silicon Graphics started selling high-performance graphics terminals using a proprietary API called Iris GL (GL is short for "graphics library"). Over the years, Iris GL grew bloated and hard to maintain, until Silicon Graphics took a radical new step: they completely refactored Iris GL and made it an open standard. Their competitors could use the new Open Graphics Library (OpenGL), but in return, they had to help maintain it and keep it up to date.

Today, OpenGL is managed by the Khronos Group -- a non-profit organization with representatives from many companies that are interested in maintaining high-quality media APIs. At a lower level, it's managed by the OpenGL Architecture Review Board (ARB). OpenGL is supported on every gaming platform, including Mac, Windows, Linux, PS3 (as a GCM wrapper), Wii, iPhone, PSP, and DS. Well, every gaming platform except for the XBox -- which brings us to our next topic:

## What is DirectX?

Ever since MS-DOS, Microsoft has understood that games play an important role in users' choice of operating systems. For this reason, in 1995, they created a proprietary set of libraries in order to encourage exclusive games for their new Windows 95 operating system. These libraries included Direct3D, DirectInput and DirectSound, and the entire collection came to be known as DirectX. When Microsoft entered the gaming market in 2001, it introduced the DirectX Box, or XBox for short. The XBox was a loss leader (losing over 4 billion dollars), intended to set the stage to dominate the games market in the next generation.

Looking at the games scene now, it's clear that this strategy is succeeding. Most major PC games now use DirectX, and run on both Windows and XBox 360. With few exceptions, they don't work on competing platforms, such as Playstation, Mac OS, and Wii. These are significant markets to leave out, bringing us to the big question:

## Why does everyone use DirectX?

Everyone uses DirectX because API choice in game development is a positive feedback loop, and it was shifted in favor of DirectX in 2005.

It's a positive feedback loop because whenever one API becomes more popular, it keeps becoming more and more popular due to network effects. The most important network effects are as follows: the more popular API gets better support from graphics card vendors, and graphics programmers are more likely to already know how to use it.

API use was shifted in favor of DirectX by Microsoft's two-pronged DirectX campaign around the launch of XBox 360 and Windows Vista, including the spread of FUD (fear, uncertainty and doubt) about the future of OpenGL, and wild exaggeration of the merits of DirectX. Ever since then, the network effects have amplified this discrepency until OpenGL has almost disappeared entirely from mainstream PC gaming.

### 1. Network effects and vicious cycles

On Windows, it's a fact that the DirectX graphics drivers are better maintained than the OpenGL graphics drivers. This is caused by the vicious cycle of vendor support. As game developers are driven from OpenGL to DirectX by other factors, the graphics card manufacturers (vendors) get less bug reports for their OpenGL drivers, extensions and documentation. This results in shakier OpenGL drivers, leading even more game developers to switch from OpenGL to DirectX. The cycle repeats.
Similarly, it's a fact that more gaming graphics programmers know how to use DirectX than OpenGL, so it's cheaper (less training required) to make a game using DirectX than OpenGL. This is the result of another vicious cycle: as more game projects use DirectX, more programmers have to learn how to use it. As more programmers learn to use it, it becomes cheaper for game projects to use DirectX than to use OpenGL.

### 2. FUD about OpenGL and Vista

Microsoft initiated a fear, uncertainty, and doubt (FUD) campaign against OpenGL around the release of Windows Vista. In 2003, Microsoft left the OpenGL Architecture Review Board -- showing that they no longer had any interest in the future of OpenGL. Then in 2005, they gave presentations at SIGGRAPH (special interest group for graphics) and WinHEC (Windows Hardware Engineering Conference) giving the impression that Windows Vista would remove support for OpenGL except to maintain back-compatibility with XP applications. This version of OpenGL would be layered on top of DirectX as shown here, (from the HEC presentation) causing a dramatic performance hit. This campaign led to panic in the OpenGL community, leading many professional graphics programmers to switch to DirectX.

When Vista was released, it backpedaled on its OpenGL claims, allowing vendors to create fast installable client drivers (ICDs) that restore native OpenGL support. The OpenGL board sent out newsletters proving that OpenGL is still a first-class citizen, and that OpenGL performance on Vista was still at least as fast as Direct3D. Unfortunately for OpenGL, the damage had already been done -- public confidence in OpenGL was badly shaken.

### 3. Misleading marketing campaigns

The launch strategies for Windows Vista and Windows 7 were both accompanied with an immense marketing push by Microsoft for DirectX, in which they showed 'before' and 'after' screenshots of the different DirectX versions. Many gamers now think that switching from DirectX 9 to DirectX 10 magically transforms graphics from stupidly dark to normal (as in the comparison above), or from Halo 1 to Crysis. Game journalists proved that there was no difference between Crysis DX9 and DX10, and that its "DX10" features worked fine with DX9 by tweaking a config file. However, despite its obvious inaccuracy, the marketing has convinced many gamers that DirectX updates are the only way to access the latest graphics features.
While many games participate in Microsoft's marketing charade, more savvy graphics programmers like John Carmack refuse to be swept up in it. He put it this way, "Personally, I wouldn’t jump at something like DX10 right now. I would let things settle out a little bit and wait until there’s a really strong need for it."

##  So why do we use OpenGL?

Given that OpenGL has less vendor support, is no longer used in games, is being actively attacked by Microsoft, and has no marketing momentum, why should we still use it? Wouldn't it be more profitable to ditch it and use DirectX like everyone else? No, because in reality, OpenGL is more powerful than DirectX, supports more platforms, and is essential for the future of games.

### 1. OpenGL is more powerful than DirectX

It's common knowledge that OpenGL has faster draw calls than DirectX (see NVIDIA presentations like this one if you don't want to take my word for it), and it has first access to new GPU features via vendor extensions. OpenGL gives you direct access to all new graphics features on all platforms, while DirectX only provides occasional snapshots of them on their newest versions of Windows. The tesselation technology that Microsoft is heavily promoting for DirectX 11 has been an OpenGL extension for three years. It has even been possible for years before that, using fast instancing and vertex-texture-fetch. I don't know what new technologies will be exposed in the next couple years, I know they will be available first in OpenGL.
Microsoft has worked hard on DirectX 10 and 11, and they're now about as fast as OpenGL, and support almost as many features. However, there's one big problem: they don't work on Windows XP! Half of PC gamers still use XP, so using DirectX 10 or 11 is not really a viable option. If you really care about having the best possible graphics, and delivering them to as many gamers as possible, there's no choice but OpenGL.

### 2. OpenGL is cross-platform

More than half of our Lugaru users use Mac or Linux (as shown in this blog post), and we wouldn't be surprised if the same will be true of our new game Overgrowth. When we talk to major game developers, we hear that supporting Mac and Linux is a waste of time. However, I've never seen any evidence for this claim. Blizzard always releases Mac versions of their games simultaneously, and they're one of the most successful game companies in the world! If they're doing something in a different way from everyone else, then their way is probably right.

As John Carmack said when asked if Rage was a DirectX game, "It’s still OpenGL, although we obviously use a D3D-ish API [on the Xbox 360], and CG on the PS3. It’s interesting how little of the technology cares what API you’re using and what generation of the technology you’re on. You’ve got a small handful of files that care about what API they’re on, and millions of lines of code that are agnostic to the platform that they’re on." If you can hit every platform using OpenGL, why shoot yourself in the foot by relying on DirectX?

Even if all you care about is Windows, let me remind you again that half of Windows users still use Windows XP, and will be unable to play your game if you use the latest versions of DirectX. The only way to deliver the latest graphics to Windows XP gamers (the single biggest desktop gaming platform) is through OpenGL.

### 3. OpenGL is better for the future of games

OpenGL is a non-profit open standard created to allow users on any platform to experience the highest quality graphics that their hardware can provide. Its use is being crushed by a monopolistic attack from a monolithic corporate giant trying to dominate an industry that is too young to protect itself. As Direct3D becomes the only gaming graphics API supported on Windows, Microsoft is gaining a stranglehold on PC gaming.

We need competition and freedom to drive down prices and drive up quality. A Microsoft monopoly on gaming would be very bad for both gamers and game developers.

## Can OpenGL recover?

Back in 1997, the situation was similar to how it is now. Microsoft was running a massive marketing campaign for Direct3D, and soon everyone "just knew" that it was faster and better than OpenGL. This started to change when Chris Hecker published his open letter denouncing DirectX. Soon after that, John Carmack posted his famous OpenGL rant, and put his money where his mouth was by implementing all of Id Software's games in OpenGL, proving once and for all that DirectX was unnecessary for high-end 3D gaming.

This lesson appears to have been forgotten over the last few years. Most game developers have fallen under the spell of DirectX marketing, or into the whirlpool of vicious cycles and network advantages. It's time to throw off the veil of advertisements and buzzwords, and see what's really happening. If you use DirectX, you have to choose between using the weak, bloated DirectX 9 or sacrificing most of your user-base to use DirectX 10 or 11.

On the other hand, if you use OpenGL, you get faster and more powerful graphics features than DirectX 11, and you get them on all versions of Windows, Mac and Linux, as well as the PS3, Wii, PSP, DS, and iPhone. You also get these features in the rapidly-developing WebGL standard, which may become the foundation for the next generation of browser games.

If you're a game developer, all I ask is that you do the research and compare the figures, and decide if OpenGL is a better choice. Some programmers prefer the style of the DirectX 11 API to OpenGL, but you're going to be wrapping these low-level APIs in an abstraction layer anyway, so that shouldn't be a deciding factor. If there's anything about OpenGL that you don't like, then just ask the ARB to change it -- they exist to serve you!

If you're a gamer who uses Windows XP, Mac, or Linux, I hope you can see that DirectX only exists in order to keep new games from reaching your platform, and the only way you can fight back is to support games that use OpenGL.