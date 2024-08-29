---
layout: ../../layouts/blog-layout.astro
title: 'Deep Dive into Software Grid-Based Music Sequencers'
description: 'We are diving deep into the interesting problems with implementing music sequencers.'
pubDate: 2024-08-28
tags: ["Sequencer", "Music", "JUCE", "C++", "FL Studio", "Simple Sequencer"]
---

Modern music has evolved around music software. Computers now allow us not to record and arrange music compositions programmatically. Additionally, it can also allow for the creation of new sounds via synthesizers and effects which is possible because of digital audio (ex. bitcrushing). The mother of all music software is a *DAW (Digital Audio Workstation)*. It acts as the container of all the smaller audio programs like synthesizers, sequencers, and mixers. It is like an operating system for a musician, it handles everything like devices and integrates with the audio interfaces under the hood. Users can use the already existing components in the DAW or might choose to extend their DAW functionality with various synthesizers and plugins.

Many examples of DAWs can be Ableton, Logic, Reason, and my favorite, FL Studio.

DAWs include one or many types of different sequencers. The type of sequencer that will be the focus of this blog is the *grid-based sequencer*, where there are rows of grids that can be toggled for an input audio file. It allows the user to take control of the rhythm of the audio files (usually short burst sounds). All the programs have 4/4 time signatures by default, but usually, this can be edited.

In this post, I will go through how I have implemented the [Simple Sequencer](https://github.com/TarcanGul/SimpleSequencer) and what I have learned on the way.

## The Basic Idea

So this is how Simple Sequencer looks like:

<img src="/for-blogs/SimpleSequencerDemo.gif" alt="simple sequencer" style="max-width:500px; max-height:500px">

There are 5 important components to notice with the sequencer:
- A grid toggle system. The number of grids usually comes from the time signature that is picked by the DAW (usually it is 4/4, which is a beat consisting of 4 quarter notes). Creative sequencers may allow arbitrary time signatures in chosen sections. 
- Being able to "add a row", to add a new sound.
- A button that allows a file to be picked to play to that specific grid row.
- Being able to set the BPM (beats per minute) so that the user can control the tempo.
- A play-reset button pair. Usually, this pair exists by the DAW itself but in a standalone sequencer, we need a way to play and pause the composition.

For my sequencer, I have used the C++ JUCE framework since that is what I am familiar with. With JUCE, I can create a multi-platform audio programs (thanks to JUCE CMake tools).

## Approach to Implement a Grid-based Sequencer

In the grid-based sequencer, a mechanism is needed to go through the given sequence for an arbitrary sound and play it according to the given sequence.

The way I have picked to implement it is to process the sequencer data in (near) real-time with a timer. The time step will be treated as a signal which will be triggered by the timer. The signal will be associated with a callback where a real-time check is performed whether a sound should play or not. This allows much more flexibility since the logic is not dependent on the number of beats, the user can lengthen or shrink the number of beats as they please. One downside of this approach is that the callback must be as efficient as possible since the callback will be called *a lot of times*, so special care must be given so that the performance does not suffer.

An interesting thing to think about here, knowing the nature of pre-emptive scheduling in many operating systems, is how a signal can be triggered on beat reliably without being affected by the other processes running in the operating system. The BPM must be deterministic, so there is little room for inconsistency on when a time step happens. Otherwise, the composition can be inconsistent for playback which essentially kills the point of rhythm.

## JUCE and The `HighResolutionTimer`

JUCE provides a [`HighResolutionTimer`](https://docs.juce.com/master/classHighResolutionTimer.html) class. Just like how it is explained in the documentation, `HighResolutionTimer` has a dedicated thread so it is not interrupted by anything running in the same process. What about at the OS level, how can `HighResolutionTimer` be accurate without losing priority to other threads (which are also important like the device drivers and other os tasks)? Essentially `HighResolutionTimer` relies on specific OS services that allow almost real-time *ticks*. If the JUCE code is actually examined to see how the [`HighResolutionTimer`](https://github.com/juce-framework/JUCE/blob/46c2a95905abffe41a7aa002c70fb30bd3b626ef/modules/juce_core/threads/juce_HighResolutionTimer.cpp#L153) is implemented, it can be know that it is composed of a `PlatformTimer` which then during compile time can either derive the implementation from [the generic implementation](https://github.com/juce-framework/JUCE/blob/46c2a95905abffe41a7aa002c70fb30bd3b626ef/modules/juce_core/native/juce_PlatformTimer_generic.cpp#L41) or [the windows implementation](https://github.com/juce-framework/JUCE/blob/46c2a95905abffe41a7aa002c70fb30bd3b626ef/modules/juce_core/native/juce_PlatformTimer_windows.cpp). If you look deeper in to the generic implementation that does not include the Windows implementation, you will see that firstly *the highest priority thread that is not real-time priority* is created and then it is [tried to be promoted if using MacOS or IOS](https://github.com/juce-framework/JUCE/blob/46c2a95905abffe41a7aa002c70fb30bd3b626ef/modules/juce_core/native/juce_PlatformTimer_generic.cpp#L122). For Linux, `HighResolutionTimer` seems to be not creating a realtime thread and the priority is not inherently useful since the [`SCHED_OTHER`](https://www.man7.org/linux/man-pages/man7/sched.7.html) strategy is used by default. For creating a real-time thread in Linux, the scheduling strategy must be switched to [`SCHED_RR`](https://www.man7.org/linux/man-pages/man7/sched.7.html) which in turn takes the thread priority into account. In JUCE creating real-time threads with [`SCHED_RR`](https://www.man7.org/linux/man-pages/man7/sched.7.html) is supported, it is not just used by the `HighResolutionTimer`. Continuing the flow, the gist of the implementation comes down to using `Time::getMillisecondCounterHiRes()` which for different operating systems, calls their respective available methods (for example for Mac, [`mach_absolute_time()` is called](https://developer.apple.com/documentation/kernel/1462446-mach_absolute_time)).

## Other Sequencing Methods

Grid-based sequencer is not the only type of sequencer. A lot of DAWs also give you the ability to *sequence patterns* that are created by the grid-based sequencers, which have a time on a grid board fashion that is inherently different. There is [MIDI](https://en.wikipedia.org/wiki/MIDI) sequencing which uses an event-driven approach that handles timing by using timestamps.

## Wrap-up

In this blog post, grid-based sequencing is explored, and how a grid-based sequencer has been implemented using the JUCE `HighResolutionTimer`.

Please check out [Simple Sequencer](https://github.com/TarcanGul/SimpleSequencer) and give it a star!

**Thank you for reading and hopefully you learned something!**
