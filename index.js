const MinRedisQueue = require('./min-redis-queue')
const MinRedisQueueProcessor = require('./min-redis-queue-processor')
module.exports = {
    MinRedisQueue,
    MinRedisQueueProcessor,
    createQueue(options) {
        if(!options.name)
            options.name = 'default'
        if(!options.prefix)
            options.prefix = 'mrq_'
        let defaultCred = false
        if(!options.host && !options.port && !options.password && !options.db) defaultCred = true
        const queueName = `${options.prefix}${options.name}`
        if(defaultCred) return new MinRedisQueue(queueName)
        return new MinRedisQueue(queueName, options)
    }
}