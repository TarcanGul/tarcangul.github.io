---
layout: ../../layouts/blog-layout.astro
title: 'Using Audio Queue Services by Apple for Audio Programming'
description: 'We are exploring what we can do with the Audio Queue Services provided by Apple.'
pubDate: 2025-01-20
tags: ["Apple", "Core Audio", "Apple Queue Services", "Music", "JUCE", "C++", "wav", "macOS"]
---

Audio programming forms the backbone of modern media applications, enabling playback, recording, and real-time processing. It allows the creation of creative applications, for example Digital Audio Workstations (DAW) and game engines, as well as industry applications, for example for [Acoustic Vehicle Alerting Systems (AVAS)](https://conti-engineering.com/components/acoustic-vehicle-alerting-system-avas/) for automative applications. There are many great libraries built by different companies and communities that aids the development of audio applications. 

## Audio Queue Services

Apple’s [Audio Queue Services (AQS)](https://developer.apple.com/documentation/audiotoolbox/audio-queue-services?language=objc) is a C programming interface in the Audio Toolbox framework, for interacting directly with audio hardware provided by the MacOS operating system. It is part of [Core Audio](https://developer.apple.com/documentation/coreaudio?language=objc). I opted to create a WAV audio player using AQS due to its direct access to hardware APIs. Traditional high-level frameworks like [JUCE](https://juce.com/) hides a lot of complexity on audio playback and algorithms so that it can provide cross-patform support and optimization out of the box. With AQS, I bypassed this chain.

## Reading WAV Files

The WAV file format is a fundamental and widely supported audio file format, making it a great starting point for low-level audio programming. At its core, the WAV file consists of a header and raw audio data. The header contains crucial metadata such as the sample rate, bit depth, number of channels, and the total size of the audio data. Understanding this structure allows developers to directly interact with the audio data without relying on third-party libraries. [I have referenced this website for seeing the exact layout of the WAV file](https://docs.fileformat.com/audio/wav/).

In my implementation, I began by opening the WAV file in binary mode to read its contents byte by byte. The first step was parsing the header, which is typically 44 bytes long. This includes fields like the "RIFF" chunk descriptor, the format type ("WAVE"), and the "fmt" subchunk, which specifies details like the audio format (PCM), number of channels, sample rate, and bit depth.

Once the header was parsed, I proceeded to read the audio data in manageable chunks. This chunk-based approach ensures that memory usage remains efficient, especially for larger audio files. Each chunk of data was decoded and loaded into an audio buffer that could be sent to the playback queue. This level of control is essential for applications that demand precision, such as audio editing tools or custom playback engines.

Handling the WAV file directly have exposed me to the core logic of audio playback which is essentially read the data in chunks and deliver it to the hardware using the interface provided by the operating system.

If I wanted to support other file formats, I can use the same approach, but for example reading the MP3 format is not as straight forward because the data would be compressed. We will go into details but for example we have set the `mFramesPerPacket` field for the `AudioStreamBasicDescription` to be 1 because for uncompressed audio files (such as `.wav`), the number of frames will be the same as packets. This is not true for the MP3 format. Luckily there are libraries like JUCE to handle all different types of audio files, it is hard for a developer to be in touch with different nuances each file format introduces. 

## Using Audio Queue Services in C++

Throught this section, [I will be referring to my code here](https://github.com/TarcanGul/sound). Please check the [Tsound.cpp](https://github.com/TarcanGul/sound/blob/main/src/Tsound.cpp) for the main logic.

There are many steps that my music player goes through to read and play the file.

1. **Initialization:**
   I am reading the wav file as byte stream using `std::ifstream`. I get all the metadata I need and then read all the audio data.
2. **Configuration:**
   I am construcing my custom object `SoundPlaybackData` to hold state about the playback of a file. This is important because as a music player application you have to keep state about the currently running audio file. Then I construct `AudioStreamBasicDescription` that will configure my playback options.The `AudioStreamBasicDescription` struct is used to specify the audio format details, such as sample rate, bit depth, and number of channels. These parameters must match the specifications of the WAV file to ensure accurate playback. For sample rate, I have went by 44100 which is an industry standard (it is a standard because it allows recreating 20000 Hz digitally, and is also `2^2*3^2*5^2*7^2` which helps with processing). I have also set other configurations. One of them is this which we already discussed:
   ```C++
   desc.mFramesPerPacket = 1;
   ```
    which essentially means that the input file is uncompressed.

    A frame represents a single set of samples, where:
      - Each sample corresponds to one channel.
      - For example, in stereo audio (2 channels), a frame includes one sample for the left channel and one sample for the right channel.
    A packet is an higher-level data structure that can contain multiple frames. For uncompressed audio, packets and frames have a 1:1 relationship.

    There are also other critical options, like this:

    ```C++
    desc.mBytesPerFrame = 4;
    ```
    which tells that each frame will have 32 bits of information, for us this would equate to 16-bit stereo WAV format where we will use 16 bits for the left channel and 16 bits for the right channel, summing to 32.

    After that, I am creating the `AudioQueueNewOutput` with the configuration and the custom __output callback__ (the method `atQueueEmpty` in my code) which is essential. This callback will be called whenever the buffers are empty, so this callback is responsible with feeding in new audio data. If there is no unread data left, then the callback will simply return.

3. **Creating and Managing Buffers:**
   Audio buffers are the core of the queue system. I allocated a set of buffers (exactly 3 buffers) and filled them with audio data from the WAV file. The number of buffers can be chosen to be different, I have chosen 3 because it worked for me and I don't need to have the most optimized number. For our case, optimization will not be relevant. Before calling the  `AudioQueueStart` method, I need to fill the buffer. I have chosen `0x10000` (65536) as the buffer size for experimentation but as you notice there is a tradeoff of using larger buffer sizes vs. a small one. Larger buffers reduce the frequency of refills but increase latency, while smaller buffers improve responsiveness but require more frequent refills.

4. **Callback Implementation:**
   The callback function (`atQueueEmpty`) is invoked whenever a buffer is ready for reuse. In this function, I refilled the buffer with the next chunk of audio data from the WAV file and re-enqueued it for playback. This cycle ensures continuous audio output.

5. **Starting Playback:**
   Once the buffers were prepared and enqueued, I started the playback queue using the `AudioQueueStart` function. This triggered the queue to begin processing and playing the audio data in real-time.

6. **Handling Cleanup:**
   Proper cleanup is essential to avoid resource leaks. After playback was complete, I stopped the queue using `AudioQueueStop` and disposed of it with `AudioQueueDispose`. This released all associated resources and ensured that the application remained efficient.

This hands-on implementation with Audio Queue Services provided invaluable insights to me about low-level audio programming. By directly managing the audio pipeline, I was able to achieve precise control over playback behavior, making it suitable for applications requiring high performance and customization.

## Conclusion

Apple’s Audio Queue Services empower developers to create efficient and high-performance audio applications by interacting directly with hardware. By parsing WAV files byte by byte and leveraging AQS in C++, I was able to build a lightweight and flexible audio player. Check out my WAV player implementation on [GitHub](https://github.com/TarcanGul/sound).

**Thank you for reading and hopefully you learned something!**
