WITH
  total_acts AS (
    SELECT
      COUNT(DISTINCT id) AS total_acts
    FROM
      revolt_2_earn."GovernorBravoDelegate_evt_ProposalCreated"
  ),
  executed_acts AS (
    SELECT
      COUNT(DISTINCT id) AS executed_acts
    FROM
      revolt_2_earn."GovernorBravoDelegate_evt_ProposalExecuted"
  ),
  cancelled_acts AS (
    SELECT
      COUNT(DISTINCT id) AS cancelled_acts
    FROM
      revolt_2_earn."GovernorBravoDelegate_evt_ProposalCanceled"
  ),
  open_acts AS (
    SELECT
      COUNT(DISTINCT id) AS open_acts
    FROM
      revolt_2_earn."GovernorBravoDelegate_evt_ProposalCreated"
    WHERE
      NOW() < to_timestamp("endBlock"):: timestamp
  )
SELECT
  executed_acts AS approved_acts,
  (
    total_acts - cancelled_acts - open_acts - executed_acts
  ) AS rejected_acts,
  cancelled_acts,
  total_acts - open_acts AS closed_acts,
  open_acts
FROM
  total_acts,
  executed_acts,
  open_acts,
  cancelled_acts 