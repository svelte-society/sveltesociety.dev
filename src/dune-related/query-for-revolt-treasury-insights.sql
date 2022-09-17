WITH
  price AS (
    SELECT
      datex,
      contract_address,
      decimals,
      symbol,
      price
    FROM
      dune_user_generated.rvlt_Price
  ),
  holdings AS (
    SELECT
      datex,
      contract_address AS token_address,
      SUM(amount) AS token_change,
      SUM(SUM(amount)) OVER (
        ORDER BY
          datex
      ) AS holding
    FROM
      (
        SELECT
          date_trunc('DAY', evt_block_time) AS datex,
          contract_address,
          (-1) * value AS amount
        FROM
          erc20."ERC20_evt_Transfer"
        WHERE
          contract_address = '\xf0f9D895aCa5c8678f706FB8216fa22957685A13'
          AND "from" = '\x86c66aedd67c184fdad4293261f49b069510ff64'
        UNION ALL
        SELECT
          date_trunc('DAY', evt_block_time) AS datex,
          contract_address,
          value AS amount
        FROM
          erc20."ERC20_evt_Transfer"
        WHERE
          contract_address = '\xf0f9D895aCa5c8678f706FB8216fa22957685A13'
          AND "to" = '\x86c66aedd67c184fdad4293261f49b069510ff64'
      ) x
    GROUP BY
      1,
      2
  )
SELECT
  DISTINCT x.datex,
  token_address,
  token,
  token_holdings,
  usd_holdings,
  usd_holdings / eth_price AS eth_holdings
FROM
  (
    SELECT
      DISTINCT h.datex,
      CONCAT(
        '<a href="https://etherscan.io/address/0',
        SUBSTRING("token_address":: text, 2),
        '" target="_blank" >',
        "token_address",
        '</a>'
      ) AS token_address,
      symbol AS token,
      holding / 10 ^ decimals AS token_holdings,
      holding * price / 10 ^ decimals AS usd_holdings
    FROM
      holdings h
      INNER JOIN price p ON h.token_address = p.contract_address
      AND h.datex = p.datex
  ) x
  LEFT JOIN (
    SELECT
      date_trunc('DAY', minute) AS datex,
      FIRST_VALUE(price) OVER (
        ORDER BY
          minute DESC
      ) AS eth_price
    FROM
      prices.usd
    WHERE
      symbol = 'WETH'
  ) y ON x.datex = y.datex
ORDER BY
  1 DESC