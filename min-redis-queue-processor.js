class MinRedisQueueProcessor {

    /**
     * Default constructor
     * @param minRedisQueue - queue
     */
    constructor(minRedisQueue) {
        this._minRedisQueue = minRedisQueue
    }

    /**
     * Start processor
     * @param interval - interval between pops
     * @param callback - callback
     */
    start(interval, callback) {
        this._interator = setInterval(() => {
            this._minRedisQueue.pop().then((object) => {
                if(object)
                    callback(object)
            }).catch((err) => {
                callback({}, err)
            })
        }, interval)
    }

    /**
     * Stop processor
     */
    stop() {
        clearInterval(this._interator)
    }
}

module.exports = MinRedisQueueProcessor