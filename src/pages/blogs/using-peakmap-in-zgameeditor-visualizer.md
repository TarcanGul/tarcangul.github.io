---
layout: ../../layouts/blog-layout.astro
title: 'Surfing the Sound: Using Peakmap in ZGameEditor Visualizer'
description: 'How I combined a surfer image, Peakmap, and a moving wave to create music-reactive visuals that support my song.'
pubDate: 2026-09-17
tags: ["Music", "Music Visualization", "FL Studio", "ZGameEditor Visualizer", "Peakmap"]
---

## Background: Music Visualization and ZGameEditor Visualizer

These days artists have many options sharing and releasing their music. Since as an artist I just started picking producing back up, I wanted to explore options. One option I have been exploring lately is Youtube. Youtube is a great platform with 2.5 billion users (( fact check this )). Traditionally you can release your track with a simple background image but this does not utilize the full potential on what you can do. Let me introduce you to ZGameEditor Visualizer within FL studio (( expand ZGameEditor Visualizer to 2 sentences)). 

## Imagining a Surfer Inside the Music

For my new track "Shake Out!" (( put youtube and soundcloud links to my song )) I wanted to create an interactive experience where I wanted to have a surfer surfing in the middle of the screen with big water waves since the song kind of made me feel of water (likely because of heavy use of noise throughout the track). To bring this vision to reality, I used zgameeditor visualizer.

## Making the Surfer React with Peakmap

For the surfer, I needed a png file. This is the png file I went with: ![surfer](../../images/blogs/surfer.png). For background I used this: ![background](../../images/blogs/water_tunnel_texture_2.png). For mask I used ![mask](../../images/blogs/mask.png).

## Bringing the Scene Together with a Wave, Mask, and Buffer

This is the order I used in my zgameeditor visualizer patch (( put the order here )). The peakmap is now following the frequency response of the track that is coming as an input. I added extra spice with raindrops and the end result is an engaging visualization for my dance track.

## References

- [My music video](https://www.youtube.com/watch?v=qN4D0hA4fE4)
- [Image-Line: ZGameEditor Visualizer manual](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins/ZGameEditor%20Visualizer.htm) — layer order, audio sources, and buffer behavior. Peakmap-specific observations come from my setup and examples.
