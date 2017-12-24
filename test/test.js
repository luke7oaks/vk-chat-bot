/* eslint-env mocha */

const assert = require('assert')

const ChatBot = require('../src/vk-chat-bot.js')
const log = new (require('../src/log.js'))()

var botParams = {
  vk_api_key: 'test',
  confirmation_token: 'test',
  group_id: 'test',
  secret: 'test',
  cmd_prefix: '/'
}

describe('Log', () => {
  describe('#terminate()', () => {
    it('should throw an Error', () => {
      assert.throws(() => {
        log.terminate()
      }, Error)
    })
  })

  describe('#requireFunction()', () => {
    it('should throw an Error when argument is not a function', () => {
      assert.throws(() => {
        log.requireFunction('not-a-function')
      }, Error)
    })

    it('shouldn\'t throw an Error when argument is a function', () => {
      assert.doesNotThrow(() => {
        log.requireFunction($ => {})
      }, Error)
    })
  })

  describe('#requireParams()', () => {
    it('should throw an Error when at least one argument is invalid', () => {
      assert.throws(() => {
        log.requireParams('test', undefined, null)
      }, Error)
    })

    it('shouldn\'t throw an Error when all arguments are valid', () => {
      assert.doesNotThrow(() => {
        log.requireParams('test', 'a', 'b')
      }, Error)
    })
  })
})

describe('ChatBot', () => {
  describe('#constructor()', () => {
    it('should throw an Error with missing required params', () => {
      assert.throws(() => {
        /* eslint-disable no-new */
        new ChatBot({
          group_id: 'test',
          cmd_prefix: 'test'
        })
        /* eslint-enable no-new */
      }, Error)
    })

    it('shouldn\'t throw an Error when everything\'s right', () => {
      assert.doesNotThrow(() => {
        /* eslint-disable no-new */
        new ChatBot(botParams)
        /* eslint-enable no-new */
      }, Error)
    })
  })

  describe('#start()', () => {
    it('should throw an Error when no port specified', () => {
      assert.throws(() => {
        var bot = new ChatBot(botParams)
        bot.start()
      }, Error)
    })

    it('shouldn\'t throw an Error when everything\'s right', () => {
      assert.doesNotThrow(() => {
        var bot = new ChatBot(botParams)
        bot.start(12345)
      }, Error)
    })
  })
})

describe('Behavior', () => {
  describe('#on()', () => {
    it('should throw an error with wrong event name', () => {
      assert.throws(() => {
        var bot = new ChatBot(botParams)
        bot.on('', () => {})
      }, Error)
    })

    it('should throw an error with missing parameters', () => {
      assert.throws(() => {
        var bot = new ChatBot(botParams)
        bot.on('no_match')
      }, Error)
    })

    it('shouldn\'t throw an error when everything\'s right', () => {
      assert.doesNotThrow(() => {
        var bot = new ChatBot(botParams)
        bot.on('no_match', ($) => {})
      }, Error)
    })
  })

  describe('#cmd()', () => {
    it('should throw an error with missing parameters', () => {
      assert.throws(() => {
        var bot = new ChatBot(botParams)
        bot.cmd('test')
      }, Error)
    })

    it('shouldn\'t throw an error when everything\'s right (3 params)', () => {
      assert.doesNotThrow(() => {
        var bot = new ChatBot(botParams)
        bot.cmd('test', 'sure thing tests something', ($) => {})
      }, Error)
    })

    it('shouldn\'t throw an error when everything\'s right (2 params)', () => {
      assert.doesNotThrow(() => {
        var bot = new ChatBot(botParams)
        bot.cmd('test', ($) => {})
      }, Error)
    })
  })

  describe('#regex()', () => {
    it('should throw an error with missing parameters', () => {
      assert.throws(() => {
        var bot = new ChatBot(botParams)
        bot.regex('.*')
      }, Error)
    })

    it('shouldn\'t throw an error when everything\'s right', () => {
      assert.doesNotThrow(() => {
        var bot = new ChatBot(botParams)
        bot.regex('.*', ($) => {})
      }, Error)
    })
  })

  describe('#help()', () => {
    it('should return a proper help message', () => {
      var bot = new ChatBot(botParams)

      bot.cmd('test', 'sure thing tests something', ($) => {})
      bot.cmd('help', 'shows the help message', ($) => {})

      var message = '\n/test - sure thing tests something\n/help - shows the help message\n'
      assert.equal(bot.help(), message)
    })
  })
})
