---
title: "Week 03 — Serial communication: UART, SPI, I²C"
description: The three most common serial protocols in embedded systems — how each works, when to choose which, and how to configure them on STM32.
---

<div class="week-badge">Week 03 · Embedded Systems</div>

*(Notes in progress — class is Thursday.)*

## Summary

Three protocols dominate embedded serial communication. They differ in wiring complexity, speed, and how many devices they support on a single bus.

| Protocol | Wires | Topology | Speed | Use case |
|----------|-------|----------|-------|----------|
| UART | 2 (TX, RX) | point-to-point | ~5 Mbps | Debug, GPS, Bluetooth modules |
| SPI | 4 (MOSI, MISO, SCK, CS) | one master, N slaves | ~50 Mbps | Displays, flash memory, sensors |
| I²C | 2 (SDA, SCL) | multi-master bus | ~3.4 Mbps | Sensors, EEPROMs, RTCs |

## UART

*(notes coming)*

## SPI

*(notes coming)*

## I²C

*(notes coming)*

## Key takeaways

*(to be filled after class)*

## Open questions

*(to be filled after class)*
