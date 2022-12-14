var assert = require('chai').assert;
var Terminal = require('../src/xterm');

describe('CompositionHelper', function () {
  var terminal;
  var compositionHelper;
  var compositionView;
  var textarea;
  var handledText;

  beforeEach(function () {
    compositionView = {
      classList: {
        add: function () {},
        remove: function () {},
      },
      getBoundingClientRect: function () {
        return { width: 0 }
      },
      style: {
        left: 0,
        top: 0
      },
      textContent: ''
    };
    textarea = {
      value: '',
      style: {
        left: 0,
        top: 0
      }
    };
    terminal = {
      element: {
        querySelector: function () {
          return { offsetLeft: 0, offsetTop: 0 };
        }
      },
      handler: function (text) {
        handledText += text;
      }
    };
    handledText = '';
    compositionHelper = new Terminal.CompositionHelper(textarea, compositionView, terminal);
  });

  describe('Public API', function () {
    it('should define CompositionHelper.prototype.compositionstart', function () {
      assert.isDefined(Terminal.CompositionHelper.prototype.compositionstart);
    });
    it('should define CompositionHelper.prototype.compositionupdate', function () {
      assert.isDefined(Terminal.CompositionHelper.prototype.compositionupdate);
    });
    it('should define CompositionHelper.prototype.compositionend', function () {
      assert.isDefined(Terminal.CompositionHelper.prototype.compositionend);
    });
    it('should define CompositionHelper.prototype.finalizeComposition', function () {
      assert.isDefined(Terminal.CompositionHelper.prototype.finalizeComposition);
    });
    it('should define CompositionHelper.prototype.handleAnyTextareaChanges', function () {
      assert.isDefined(Terminal.CompositionHelper.prototype.handleAnyTextareaChanges);
    });
    it('should define CompositionHelper.prototype.updateCompositionElements', function () {
      assert.isDefined(Terminal.CompositionHelper.prototype.updateCompositionElements);
    });
    it('should define CompositionHelper.isComposing', function () {
      assert.isDefined(compositionHelper.isComposing);
    });
    it('should define CompositionHelper.isSendingComposition', function () {
      assert.isDefined(compositionHelper.isSendingComposition);
    });
  });

  describe('Input', function () {
    it('Should insert simple characters', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: '???' });
      textarea.value = '???';
      setTimeout(function() { // wait for any textarea updates
        compositionHelper.compositionend();
        setTimeout(function() { // wait for any textarea updates
          assert.equal(handledText, '???');
          // Second character '???'
          compositionHelper.compositionstart();
          compositionHelper.compositionupdate({ data: '???' });
          textarea.value = '??????';
          setTimeout(function() { // wait for any textarea updates
            compositionHelper.compositionend();
            setTimeout(function() { // wait for any textarea updates
              assert.equal(handledText, '??????');
              done();
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    });

    it('Should insert complex characters', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: '???' });
      textarea.value = '???';
      setTimeout(function() { // wait for any textarea updates
        compositionHelper.compositionupdate({ data: '???' });
        textarea.value = '???';
        setTimeout(function() { // wait for any textarea updates
          compositionHelper.compositionupdate({ data: '???' });
          textarea.value = '???';
          setTimeout(function() { // wait for any textarea updates
            compositionHelper.compositionend();
            setTimeout(function() { // wait for any textarea updates
              assert.equal(handledText, '???');
              // Second character '???'
              compositionHelper.compositionstart();
              compositionHelper.compositionupdate({ data: '???' });
              textarea.value = '??????';
              setTimeout(function() { // wait for any textarea updates
                compositionHelper.compositionupdate({ data: '???' });
                textarea.value = '??????';
                setTimeout(function() { // wait for any textarea updates
                  compositionHelper.compositionupdate({ data: '???' });
                  textarea.value = '??????';
                  setTimeout(function() { // wait for any textarea updates
                    compositionHelper.compositionend();
                    setTimeout(function() { // wait for any textarea updates
                      assert.equal(handledText, '??????');
                      done();
                    }, 0);
                  }, 0);
                }, 0);
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    });

    it('Should insert complex characters that change with following character', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: '???' });
      textarea.value = '???';
      setTimeout(function() { // wait for any textarea updates
        compositionHelper.compositionupdate({ data: '???' });
        textarea.value = '???';
        setTimeout(function() { // wait for any textarea updates
          // Start second character '???' in first character
          compositionHelper.compositionupdate({ data: '???' });
          textarea.value = '???';
          setTimeout(function() { // wait for any textarea updates
            compositionHelper.compositionend();
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: '???' });
            textarea.value = '??????'
            setTimeout(function() { // wait for any textarea updates
              compositionHelper.compositionend();
              setTimeout(function() { // wait for any textarea updates
                assert.equal(handledText, '??????');
                done();
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    });

    it('Should insert multi-characters compositions', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: 'd' });
      textarea.value = 'd';
      setTimeout(function() { // wait for any textarea updates
        compositionHelper.compositionupdate({ data: '???' });
        textarea.value = '???';
        setTimeout(function() { // wait for any textarea updates
          // Second character '???'
          compositionHelper.compositionupdate({ data: '??????' });
          textarea.value = '??????';
          setTimeout(function() { // wait for any textarea updates
            compositionHelper.compositionend();
            setTimeout(function() { // wait for any textarea updates
              assert.equal(handledText, '??????');
              done();
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    });

    it('Should insert multi-character compositions that are converted to other characters with the same length', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: 'd' });
      textarea.value = 'd';
      setTimeout(function() { // wait for any textarea updates
        compositionHelper.compositionupdate({ data: '???' });
        textarea.value = '???';
        setTimeout(function() { // wait for any textarea updates
          // Second character '???'
          compositionHelper.compositionupdate({ data: '??????' });
          textarea.value = '??????';
          setTimeout(function() { // wait for any textarea updates
            // Convert to katakana '??????'
            compositionHelper.compositionupdate({ data: '??????' });
            textarea.value = '??????';
            setTimeout(function() { // wait for any textarea updates
              compositionHelper.compositionend();
              setTimeout(function() { // wait for any textarea updates
                assert.equal(handledText, '??????');
                done();
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    })

    it('Should insert multi-character compositions that are converted to other characters with different lengths', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: '???' });
      textarea.value = '???';
      setTimeout(function() { // wait for any textarea updates
        // Second character '???'
        compositionHelper.compositionupdate({ data: '???m' });
        textarea.value = '???m';
        setTimeout(function() { // wait for any textarea updates
          compositionHelper.compositionupdate({ data: '??????' });
          textarea.value = '??????';
          setTimeout(function() { // wait for any textarea updates
            // Convert to kanji '???'
            compositionHelper.compositionupdate({ data: '???' });
            textarea.value = '???';
            setTimeout(function() { // wait for any textarea updates
              compositionHelper.compositionend();
              setTimeout(function() { // wait for any textarea updates
                assert.equal(handledText, '???');
                done();
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    });

    it('Should insert non-composition characters input immediately after composition characters', function (done) {
      // First character '???'
      compositionHelper.compositionstart();
      compositionHelper.compositionupdate({ data: '???' });
      textarea.value = '???';
      setTimeout(function() { // wait for any textarea updates
        compositionHelper.compositionend();
        // Second character '1' (a non-composition character)
        textarea.value = '???1';
        setTimeout(function() { // wait for any textarea updates
          assert.equal(handledText, '???1');
          done();
        }, 0);
      }, 0);
    });
  });
});
