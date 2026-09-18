---
title: "Week 01 — Introduction & microcontroller architecture"
description: What embedded systems are, how a microcontroller is organized internally, and why the Harvard architecture matters for real-time constraints.
---

<div class="week-badge">Week 01 · Embedded Systems</div>

An embedded system is a computer built into a larger device to perform a dedicated function — often with hard constraints on power, cost, and response time. Unlike a general-purpose computer, it usually runs one program forever, interacting directly with hardware.

## What makes embedded systems different

Three constraints shape almost every design decision:

- **Real-time requirements** — a missed deadline can mean a failed brake response, a dropped audio sample, or a corrupted sensor reading. Time is a correctness criterion, not just a performance one.
- **Resource limits** — kilobytes of RAM, not gigabytes. Every allocation decision matters.
- **Direct hardware access** — no OS abstraction layer. You write to memory addresses that are physically wired to peripherals.

## Microcontroller vs microprocessor

A **microprocessor** (MPU) is just a CPU — it needs external chips for RAM, flash, I/O, and clock generation.

A **microcontroller** (MCU) integrates all of that on a single chip: CPU core, flash memory, SRAM, timers, UART, SPI, I²C, ADC, and GPIO — often for under $1.

```
┌─────────────────────────────────────────┐
│              Microcontroller             │
│  ┌───────┐  ┌──────┐  ┌─────────────┐  │
│  │  CPU  │  │ Flash│  │ Peripherals │  │
│  │ Core  │  │(code)│  │ GPIO/UART   │  │
│  └───┬───┘  └──────┘  │ SPI/I²C/ADC│  │
│      │      ┌──────┐  └─────────────┘  │
│      └──────│ SRAM │                   │
│             │(data)│                   │
│             └──────┘                   │
└─────────────────────────────────────────┘
```

## Harvard vs Von Neumann architecture

Most desktop CPUs use **Von Neumann** architecture: a single bus carries both instructions and data. This is simple but creates a bottleneck — you can't fetch an instruction and read data simultaneously.

Most microcontrollers use **Harvard** architecture: separate buses (and separate memories) for instructions and data.

| | Von Neumann | Harvard |
|---|---|---|
| Buses | 1 shared | 2 separate |
| Simultaneous fetch+load | No | Yes |
| Common in | x86, ARM Cortex-A | ARM Cortex-M, AVR, PIC |
| Benefit | Simpler design | Better real-time throughput |

The ARM Cortex-M series (which we use in this course) uses a **modified Harvard** architecture — separate internal buses, but a unified address space so the programmer doesn't see the difference directly.

## The memory map

On a Cortex-M MCU, everything is memory-mapped into a 4 GB address space, even peripherals:

```
0xFFFFFFFF ┬─────────────────────┐
           │  Vendor-specific    │
0xE0000000 ├─────────────────────┤
           │  Private Peripheral │
           │  Bus (PPB) — NVIC,  │
           │  SysTick, debug     │
0xA0000000 ├─────────────────────┤
           │  External device    │
0x60000000 ├─────────────────────┤
           │  External RAM       │
0x40000000 ├─────────────────────┤
           │  Peripherals        │  ← writing here controls GPIO, UART, etc.
0x20000000 ├─────────────────────┤
           │  SRAM               │  ← your variables live here
0x00000000 ┴─────────────────────┘
           │  Code (Flash)       │  ← your program lives here
```

To toggle a GPIO pin, you literally write a value to the address `0x40020018` (for GPIOA on STM32F4). The hardware does the rest.

## Key takeaways

1. An MCU is a complete computer on a chip — CPU, memory, and peripherals in one package.
2. Harvard architecture allows simultaneous instruction fetch and data access, which matters for deterministic timing.
3. Everything on a Cortex-M — RAM, flash, and peripherals — lives in a single 4 GB address space. Peripheral control is memory writes.
4. "Embedded" means dedicated function + direct hardware access + real-time constraints. These three things drive all the design choices we'll study this semester.

## Open questions

- How does the linker know which addresses to place `.text` and `.data` sections at? (I think this is the linker script — check before week 03.)
- What happens if two peripherals try to use the same bus simultaneously?

:::tip
The STM32 reference manual (RM0090) has the full memory map for the STM32F4 family. It's 1700 pages, but section 2.3 has everything from this week in authoritative form.
:::
