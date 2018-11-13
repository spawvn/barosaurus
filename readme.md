
# Barosaurus  
  
A small app to show current and upcoming weather in five European cities.  
  
### Constraints:  
- No ES6  
- No frameworks / libraries  
- No dependencies
- Does not need build tools, runs as is  
- Single page app  
  
### Features:  
- Show five cities with current temperature, and wind strength
- Use client-side caching when getting initial data, avoid API abuse
- Upon click, show temperature forecast for upcoming hours

### Notes:
- Given the constraints introduced by the task, and general simplicity of the application, I have chosen to use this style of coding. Please do not assume that I develop everything using vanilla JavaScript. Sometimes a usage of a framework is the best choice, and sometimes it's just shooting sparrows with a cannon.
- All JavaScript is written in the same file, for the sake of ease of streamlined examination.
- The API is usually pretty fast, and it works even faster with cache involved, nevertheless the application has a loader animation implemented. Same kind of loader could be added to hourly forecasts, but I had little time to do so.
- If the initial data request fails for any reason, the app will try to use recently cached data (if available), and if that does not work either, an error message will be displayed.
- I left some comments in the code, but generally I believe it is pretty self-explanatory, and simple.
- I know there can be found a decent amount of places where the code could be optimized, but I believe in the current setup there are no real performance impediments, so nothing to lose our sleep over.
- As for design, I used minimalist approach, since I am not designer, I just made sure things are not ugly.
- Speaking of ugly, the API provided with weather icons, a very nice feature to add to my application, though they could've looked better, oh well.
- Last but not least, using a proper font face makes your app look ten times more decent, with little to no effort.