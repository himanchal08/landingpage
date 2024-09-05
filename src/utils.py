from __future__ import annotations

import hashlib
import os
import random
import secrets
import string
from sqlite3 import Cursor, Row
from typing import Any, Generic, TypeVar

from dotenv import load_dotenv

load_dotenv()

KT = TypeVar("KT")
VT = TypeVar("VT")


class IndexedDict(Generic[KT, VT]):
    def __init__(self, *, case_sensitive: bool = False):
        self.__keys: list[KT] = []
        self.__values: list[VT] = []
        self.__actual_dict: dict[KT, VT] = {}
        self.__index_cache: dict[KT, int] = {}
        self.__size = 0

        self.__case_sensitive = case_sensitive

    def _parse_key(self, key: KT) -> Any:
        """Parse the key based on the case sensitivity.

        >>> d = IndexedDict()
        >>> d._parse_key("hello") == "hello"
        True
        """
        if self.__case_sensitive:
            return key

        if isinstance(key, str):
            return key.casefold()

        return key

    def __setitem__(self, key: KT, value: VT) -> None:
        """Set the value for the key.

        >>> d = IndexedDict()
        >>> d["hello"] = "world"
        """

        key = self._parse_key(key)

        if key in self.__actual_dict:
            self.__values[self.__index_cache[key]] = value
            self.__actual_dict[key] = value
        else:
            self.__keys.append(key)
            self.__values.append(value)
            self.__actual_dict[key] = value
            self.__index_cache[key] = self.__size
            self.__size += 1

    def __getitem__(self, key: KT) -> VT:
        """Get the value for the key.

        >>> d = IndexedDict()
        >>> d["hello"] = "world"
        >>> d["hello"]
        'world'
        >>> d[0]
        'world'
        """
        key = self._parse_key(key)

        if key in self.__actual_dict:
            return self.__actual_dict[key]

        if isinstance(key, int):
            return self.__values[int(key)]

        error = f"KeyError: {key}"
        raise KeyError(error)

    def __delitem__(self, key: KT) -> None:
        """Delete the key from the dictionary.

        >>> d = IndexedDict()
        >>> d["hello"] = "world"
        >>> del d["hello"]
        """

        key = self._parse_key(key)
        if key in self.__actual_dict:
            index = self.__index_cache[key]
        else:
            if isinstance(key, int):
                index = int(key)
                key = self.__keys[index]
            else:
                error = f"KeyError: {key}"
                raise KeyError(error)

        del self.__keys[index]
        del self.__values[index]
        del self.__actual_dict[key]
        self.__size -= 1
        self.__index_cache = {k: i for i, k in enumerate(self.__keys)}

    def __len__(self) -> int:
        return self.__size

    def __iter__(self):
        return iter(zip(self.__keys, self.__values))

    def __contains__(self, key: KT) -> bool:
        return key in self.__actual_dict

    def __repr__(self) -> str:
        return repr(self.__actual_dict)

    def items(self):
        return self.__actual_dict.items()

    def keys(self):
        return self.__actual_dict.keys()

    def values(self):
        return self.__actual_dict.values()

    def clear(self) -> None:
        self.__keys.clear()
        self.__values.clear()
        self.__actual_dict.clear()
        self.__index_cache.clear()
        self.__size = 0

    def __getattr__(self, key: KT) -> VT:
        if key in self.__actual_dict:
            return self.__actual_dict[key]

        error = f"AttributeError: {key}"
        raise AttributeError(error)


def sqlite_row_factory(cursor: Cursor, row: Row) -> IndexedDict:
    d = IndexedDict()

    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]

    return d
