import ReactDOM from "react-dom/client";

import {
  ReactiveBase,
  SearchBox,
  ReactiveList,
  ResultCard,
  SelectedFilters,
} from "@appbaseio/reactivesearch";

import "./index.css";
import { useEffect, useRef, useState } from "react";

const Main = () => {
  const [value, setValue] = useState("");
  const triggerQueryRef = useRef(null);

  useEffect(() => {
    if (triggerQueryRef.current) triggerQueryRef.current({ isOpen: true });
  }, [value]);

  return (
    <ReactiveBase
      app="good-books-ds"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
      reactivesearchAPIConfig={{
        recordAnalytics: false,
        userId: "jon",
      }}
    >
      <div className="row">
        <div className="col">
          <SearchBox
            title="SearchBox"
            dataField={["original_title", "original_title.search"]}
            componentId="BookSensor"
            highlight
            URLParams
            enablePopularSuggestions={false}
            enableRecentSuggestions={false}
            size={5}
            index="good-books-ds"
            showClear
            value={value}
            onChange={(value, triggerQuery) => {
              triggerQueryRef.current = triggerQuery;
              setValue(value);
            }}
          >
            {({
              loading,
              error,
              data,
              value,
              downshiftProps: { isOpen, getItemProps },
            }) => {
              if (loading) {
                return <div>Fetching Suggestions.</div>;
              }
              if (error) {
                return (
                  <div>
                    Something went wrong! Error details {JSON.stringify(error)}
                  </div>
                );
              }
              return isOpen && Boolean(value.length) ? (
                <div className="pill-wrapper">
                  {data.map((suggestion, index) => (
                    <button
                      className="pill-btn"
                      key={suggestion.value}
                      title={suggestion.value}
                      {...getItemProps({ item: suggestion })}
                      dangerouslySetInnerHTML={{
                        __html: suggestion.value,
                      }}
                    ></button>
                  ))}
                </div>
              ) : null;
            }}
          </SearchBox>
        </div>

        <div className="col">
          <SelectedFilters />
          <ReactiveList
            componentId="SearchResult"
            dataField="original_title"
            size={10}
            className="result-list-container"
            pagination
            react={{
              and: "BookSensor",
            }}
            render={({ data }) => (
              <ReactiveList.ResultCardsWrapper>
                {data.map((item) => (
                  <ResultCard id={item._id} key={item._id}>
                    <ResultCard.Image src={item.image} />
                    <ResultCard.Title>
                      <div
                        className="book-title"
                        dangerouslySetInnerHTML={{
                          __html: item.original_title,
                        }}
                      />
                    </ResultCard.Title>

                    <ResultCard.Description>
                      <div className="flex column justify-space-between">
                        <div>
                          <div>
                            by{" "}
                            <span className="authors-list">{item.authors}</span>
                          </div>
                          <div className="ratings-list flex align-center">
                            <span className="stars">
                              {
                                /* eslint-disable */
                                Array(item.average_rating_rounded)
                                  .fill("x")
                                  .map((_, index) => (
                                    <i className="fas fa-star" key={index} />
                                  ))
                                /* eslint-enable */
                              }
                            </span>
                            <span className="avg-rating">
                              ({item.average_rating} avg)
                            </span>
                          </div>
                        </div>
                        <span className="pub-year">
                          Pub {item.original_publication_year}
                        </span>
                      </div>
                    </ResultCard.Description>
                  </ResultCard>
                ))}
              </ReactiveList.ResultCardsWrapper>
            )}
          />
        </div>
      </div>
    </ReactiveBase>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);
