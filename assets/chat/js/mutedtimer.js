import moment from 'moment'

class MutedTimer {
    constructor(chat) {
        this.chat = chat
        this.ticking = false
        this.duration = null
    }

    startTimer() {
        if (this.ticking || !this.duration) {
            return
        }

        this.ticking = true

        // Save old input placeholder text to restore when the timer stops.
        this.oldInputPlaceholder = this.chat.input.focus().attr('placeholder')

        // Update placeholder text immediately to account for delay when using
        // `setInterval()`.
        this.updatePlaceholderText()

        // The timer ticks every second.
        this.timerInterval = setInterval(() => this.tickTimer(), 1000)

        // The timer stops when the mute expires.
        this.timerTimeout = setTimeout(() => this.stopTimer(), this.duration.asMilliseconds())
    }

    tickTimer() {
        this.duration = this.duration.subtract(1, 'seconds')
        this.updatePlaceholderText()
    }

    stopTimer() {
        if (!this.ticking) {
            return
        }

        this.ticking = false

        clearInterval(this.timerInterval)
        clearTimeout(this.timerTimeout)

        this.duration = null
        this.chat.input.focus().attr('placeholder', this.oldInputPlaceholder)
    }

    setTimer(secondsLeft = 0) {
        this.duration = moment.duration(secondsLeft, 'seconds')

        // Reset the timeout function with the new mute duration if the timer is
        // already ticking.
        if (this.ticking) {
            clearTimeout(self.timerTimeout)
            this.timerTimeout = setTimeout(() => this.stopTimer(), this.duration.asMilliseconds())
        }
    }

    updatePlaceholderText() {
        this.chat.input.focus().attr('placeholder', this.getPlaceholderText())
    }

    getPlaceholderText() {
        return `Sorry, ${this.chat.user.username}, you are muted. You can chat again in ${this.duration.humanize()}.`
    }
}

export default MutedTimer