# CircularProgressbar [![Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://www.appcelerator.com/titanium/) [![Appcelerator Titanium](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/)

Alloy Widget for creating a circular progressbar.

![](circularprogress.gif)

## Quick Start

### Installation [![gitTio](http://gitt.io/badge.png)](http://gitt.io/component/de.manumaticx.circularprogress)
Download the latest distribution ZIP-file and consult the [Titanium Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_a_Module) on how install it, or simply use the [gitTio CLI](http://gitt.io/cli):

`$ gittio install de.manumaticx.circularprogress`

### Usage

```javascript
var circularProgressbar = Alloy.createWidget('de.manumaticx.circularprogress');

// create instance
var progressView = circularProgressbar.createView({
    width: 100,
    backgroundColor: 'white',
    progressColor: 'red',
    progressWidth: 10,
    margin: 2,
    showText: true
});

// add to window
$.index.add(progressView);

// update the progress (to 75%)
progressView.setValue(75);
```

## Credits

* Malcolm Hollingsworth (for his [excellent description](http://developer.appcelerator.com/question/154274/is-there-a-way-to-create-circular-progress-bar#answer-265134))
* Ronnie Swietek and Yaron Budowski (for Android [workaround](http://developer.appcelerator.com/question/154274/is-there-a-way-to-create-circular-progress-bar#answer-276757))

## License

    The MIT License (MIT)

    Copyright (c) 2014 Manuel Lehner

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
