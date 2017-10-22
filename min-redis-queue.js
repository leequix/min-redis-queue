const redis = require('redis')

class MinRedisQueue {
    /**
     * Constructor with credentials and name
     * @param name - queue name
     * @param options - credentials
     */
    constructor(name, options) {
        this.name = name
        this.options = options
    }

    /**
     * Connect to the redis with credentials
     * @param options - credentials
     * @private
     */
    _connect(options) {
        if(options)
            this._redisClient = redis.createClient(options.port, options.host)
        else this._redisClient = redis.createClient()
        this._redisClient.auth(options.password, err => {
            if(err) throw err
        })
        this._redisClient.select(options.db, (err) => {
            if(err) throw err
        })
        this._redisClient.on('error', (err) => {
            if(err) throw err
        })
    }

    /**
     * Push object into queue on json format
     * @param object
     * @returns {Promise}
     */
    push(object) {
        return new Promise((resolve, reject) => {
            this._connect(this.options)
            this._redisClient.rpush(this.name, JSON.stringify(object), (err) => {
                if(err) reject("Can't push object to queue")
                this._redisClient.quit()
                resolve(object)
            })
        })
    }

    /**
     * Pop object from queue
     * @returns {Promise}
     */
    pop() {
        return new Promise((resolve, reject) => {
            this._connect(this.options)
            this._redisClient.llen(this.name, (len_err, length) => {
                if(len_err) reject(len_err)
                if(length <= 0) resolve(null)
                this._redisClient.rpop(this.name, (err, data) => {
                    this._redisClient.quit()
                    if(err) reject(err)
                    const object = JSON.parse(data)
                    resolve(object)
                })
            })
        })
    }

    /**
     * Returns list of objects in queue
     * @returns {Promise}
     */
    getAll() {
        return new Promise((resolve, reject) => {
            this._connect(this.options)
            this._redisClient.lrange(this.name, 0, -1, (err, data) => {
                if(err) reject(err)
                const objects = []

                data.forEach(json => {
                    objects.push(JSON.parse(json))
                })
                this._redisClient.quit()
                resolve(objects)
            })
        })
    }

}

module.exports = MinRedisQueue