import PropTypes from "prop-types";
const ContentDisplay = ({ htmlString }) => {
  //   Use a regular expression to find the oembed element in the HTML string
  const oembedRegex = /<oembed[^>]*>/g;
  const oembedMatch = htmlString.match(oembedRegex);

  // convert oembed to iframe (youtube video)
  if (oembedMatch) {
    const oembedUrl = oembedMatch[0].match(/url="([^"]*)"/)[1];

    // https://youtu.be/ke70bLeIECo?si=QdqyNLlHbFLjA-O8 this link is not working
    // https://www.youtube.com/embed/ke70bLeIECo we need to convert it to this

    let rightUrl = oembedUrl.replace("youtu.be", "youtube.com/embed");

    const iframeElement = `<iframe width="100%" height="415"  src="${rightUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    htmlString = htmlString.replace(oembedRegex, iframeElement);
  }

  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};
ContentDisplay.propTypes = {
  htmlString: PropTypes.string.isRequired,
};
export default ContentDisplay;
