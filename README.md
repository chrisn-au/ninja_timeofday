ninja_timeofday

A Time of Day state device

Installation

Step 1 - Fetch the driver

cd /opt/ninja/drivers

git clone https://github.com/chrisn-au/ninja_timeofday.git

cd ninja_timeofday

npm install

Step 2 - Update the Latitude and Longitude

edit the index.js file to update lat and lng 

Step 3 - Restart the Ninja Block process

sudo service ninjablock restart

Step 4 - Update the dashboard driver with the following states

Find the new device on the dashboard. From the cog on the top left corner choose add new state and add

DAWN
DAY
DUSK
NIGHT


License

Copyright (C) 2013 Ninja Blocks Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
