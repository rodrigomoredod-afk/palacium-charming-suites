Use this prompt to execute one ticket safely:

"""
Implement only this ticket.

Before coding:
- read the relevant files in full
- identify obvious duplication/dead code in touched scope

During coding:
- keep components/modules small
- avoid changing unrelated behavior
- centralize repeated logic into shared helpers

After coding:
- run build and lint/type checks for touched files
- fix issues introduced by this ticket
- return: changed files, why, and what remains
"""
