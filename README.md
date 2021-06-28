# Project2: Text-Mining Visualization

## Video: https://youtu.be/vO1dXyj41n8

## Live Demo：https://tim-siyuan.github.io/Text-Mining-Visualization/


## Data

The data we used was gathered from [GroupLens](https://grouplens.org/datasets/movielens/). The research gathered data from MovieLens for over 10,000 movies within the span of around 90 years. Part of the data showed the countries the movies where from, their ratings, their genres and the actors in each movie listed, among other information. For our project, we wanted to focus on the information stated above.

To process the data, we parse through the multiple datasets to get: the movie id, the title, what year it is from, the country it is from, the rating, and the list of actors for each year.

## Functionality
#### Year Slider
At the bottom of the page there is going to be a slider with the years listed on it. The slider will stay on the page while you scroll down. You can use this slider to pick what year you want to view the data for.

#### Geospacial
![map visual](https://i.imgur.com/vZ92jvB.png)
Siyuang Jiang

The map shows the highlighted countries that had movies released the year that is currently selected in the slider. The darker the red color the country is, the more movies they had that year.

#### Network
![network visual](https://i.imgur.com/iIUfPev.png)
Jie Li

The force directed visual shows the movies that had the same genre released that year grouped together. The color shows what rating they go from a scale of 0 stars to 5 stars. You can click on the legend of the ratings to omit any rating from the visual. So if the 3 star movies are deselected, the force directed diagram won't show those movies. Multiple rating can be selected and deselected. 

#### Word Cloud
![text visual](https://i.imgur.com/Znk5O2t.png)
Roberto Gomez Pomares

The word cloud looks at the data for the actors of the year selected and creates a visual with the most recurring actors of that year and how many times they appear in a movie. When you hover over the name of the actor a small window will appear next to your cursor giving you the number of times they have appear that year. When the slider for the years is moved, the word cloud will update to whatever year is now selected.

## Findings

- For the map, not many countries aside from the US and Australia were highlighted until the 1980s to 1990s. This could be do to the data being gathered from the US so not many people could see movies from other countries until reaching the modern ear.
- The Drama and Romance genres were the most common ganres in the early years until around the late 70s, when comedy and thriller start to have more movies.
- By the 90s, action and adventure genres started to be more common as well
