import { getAllTitles } from "./Queries";

/**
 * Return a letter title formatted as "TITLE (1)" if this title already exist in the given list of titles.
 * 
 * @param {string} letterTitle 
 * @param {string} titleList 
 * @returns new title
 */
export const checkTitleRedundancy = async (letterTitle, userId) => {
    const allTitles = await getAllTitles(userId);

    // Compare fetched title with the current one
    var titleNumber = 1;
    var newTitle = letterTitle;
    var end = false;

    while (!end) {
        end = allTitles.every(storedTitle => {
        if (newTitle === storedTitle) {
            newTitle = letterTitle + ` (${titleNumber})`;
            titleNumber++;
            return false;
        }
        return true;
        })
    }

    return newTitle;
};