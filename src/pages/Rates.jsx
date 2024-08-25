import { Wave } from "react-animated-text";

import {
  Container,
  Filter,
  Heading,
  Loader,
  RatesList,
  Section,
} from "components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBaseCurrency,
  selectFilteredRates,
  selectIsError,
  selectIsLoading,
  selectRates,
} from "reduxState/selectors";
import { useEffect } from "react";
import { fetchLatestCurrency } from "reduxState/currency/operations";

const Rates = () => {
  const isError = useSelector(selectIsError);
  const isLoading = useSelector(selectIsLoading);
  const baseCurrency = useSelector(selectBaseCurrency);
  const rates = useSelector(selectRates);
  const dispatch = useDispatch();
  const filteredRates = useSelector(selectFilteredRates);
  useEffect(() => {
    dispatch(fetchLatestCurrency(baseCurrency));
  }, [dispatch, baseCurrency]);
  console.log(filteredRates);
  return (
    <Section>
      <Container>
        <Heading
          info
          bottom
          title={
            <Wave
              text={`$ $ $ Current exchange rate for 1 ${baseCurrency} $ $ $`}
              effect="fadeOut"
              effectChange={4.0}
            />
          }
        />
        {rates.length > 0 && <Filter />}
        {filteredRates.length > 0 && <RatesList rates={filteredRates} />}
        {isLoading && <Loader />}

        {isError && (
          <Heading
            error
            title="Something went wrong...😐 We cannot show current rates!"
          />
        )}
      </Container>
    </Section>
  );
};

export default Rates;
