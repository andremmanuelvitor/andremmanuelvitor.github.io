---
title: "Week 02 — GPIO, timers, and interrupts"
description: Configuring GPIO pins as inputs and outputs, using hardware timers for precise timing, and handling asynchronous events with interrupts.
lastUpdated: 2026-09-17
---

<div class="week-badge">Week 02 · Embedded Systems</div>

The three topics this week are the foundation for almost every embedded application: you need to read inputs, control outputs, measure time, and respond to events without busy-waiting.

## GPIO — General Purpose Input/Output

Each GPIO pin can be configured as input or output by writing to control registers. On STM32F4, a GPIO port is a group of 16 pins sharing the same base address.

### Configuring a pin

Every GPIO pin has four settings you must configure before using it:

| Register | What it controls |
|----------|-----------------|
| `MODER` | Mode: input / output / alternate function / analog |
| `OTYPER` | Output type: push-pull or open-drain |
| `OSPEEDR` | Slew rate: low / medium / high / very high |
| `PUPDR` | Pull-up / pull-down / none |

```c
// Enable clock to GPIOA (peripherals are off by default to save power)
RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;

// Set PA5 as output, push-pull, no pull
GPIOA->MODER  |=  (1 << (5 * 2));   // MODER5 = 01 (output)
GPIOA->OTYPER &= ~(1 << 5);         // push-pull
GPIOA->PUPDR  &= ~(3 << (5 * 2));   // no pull
```

### Writing and reading

```c
// Set PA5 high
GPIOA->BSRR = (1 << 5);

// Set PA5 low  (upper 16 bits of BSRR are reset bits)
GPIOA->BSRR = (1 << (5 + 16));

// Read PA0 (input pin)
uint8_t state = (GPIOA->IDR >> 0) & 1;
```

:::note
Always use `BSRR` for setting/clearing — not `ODR`. Writing to `ODR` is not atomic; an interrupt between a read and a write can corrupt the state of other pins.
:::

## Timers

The STM32F4 has 14 timers. The general-purpose ones (TIM2–TIM5) are 32-bit counters that can:

- Generate periodic interrupts (timebase)
- Measure pulse widths (input capture)
- Generate PWM signals (output compare)

### Basic timer configuration

A timer increments its counter register (`CNT`) on each tick. When `CNT` reaches the auto-reload register (`ARR`), it resets and optionally fires an interrupt.

```
Tick frequency = Timer clock / (PSC + 1)
Overflow period = (ARR + 1) / Tick frequency
```

```c
// Configure TIM2 to fire every 1 second
// APB1 clock = 84 MHz on STM32F4 Discovery

TIM2->PSC = 8399;        // prescaler: 84 MHz / 8400 = 10 kHz
TIM2->ARR = 9999;        // auto-reload: 10 kHz / 10000 = 1 Hz
TIM2->DIER |= TIM_DIER_UIE;  // enable update interrupt
TIM2->CR1  |= TIM_CR1_CEN;   // start the timer
```

## Interrupts and the NVIC

An interrupt lets the CPU respond to an event without polling. When the event fires, the CPU:

1. Finishes the current instruction
2. Saves registers to the stack
3. Jumps to the **ISR** (Interrupt Service Routine)
4. Restores registers and returns

The **NVIC** (Nested Vectored Interrupt Controller) is the Cortex-M component that manages priorities and routing for up to 240 external interrupts.

```c
// Enable TIM2 interrupt in the NVIC
NVIC_SetPriority(TIM2_IRQn, 1);
NVIC_EnableIRQ(TIM2_IRQn);

// The ISR — must match the name in the vector table exactly
void TIM2_IRQHandler(void) {
    if (TIM2->SR & TIM_SR_UIF) {      // check update flag
        TIM2->SR &= ~TIM_SR_UIF;      // clear flag (important!)
        GPIOA->BSRR = (1 << (5 + 16)); // toggle LED
    }
}
```

:::caution
Always clear the interrupt flag inside the ISR. If you don't, the ISR will immediately re-enter after it returns, locking up the program.
:::

## Key takeaways

1. GPIO pins need explicit configuration before use. The peripheral clock also needs to be enabled — they're gated off by default.
2. Use `BSRR` for atomic bit manipulation on GPIO output, never direct `ODR` write.
3. Timer period = `(PSC + 1) × (ARR + 1) / timer_clock`. Adjust both registers to hit the target frequency.
4. The NVIC manages all external interrupts. Set priority, enable the interrupt in the NVIC, and enable it in the peripheral's own register.
5. Always clear the interrupt flag at the start of the ISR.

## Open questions

- What is the actual priority level numbering — lower number = higher priority or lower priority? The HAL docs seem to say the opposite of the CMSIS docs.
- Can two ISRs run simultaneously, or does one preempt the other based on priority?
