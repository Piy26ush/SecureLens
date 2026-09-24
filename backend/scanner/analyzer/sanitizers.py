import ast
from typing import Optional, Tuple

class SanitizerRegistry:
    """
    Identifies contextual security sanitizers, type-coercion boundaries,
    and parameterized execution patterns.
    """

    TYPE_CAST_FUNCTIONS = {'int', 'float', 'bool'}
    COMMAND_SANITIZERS = {'shlex.quote', 'quote'}
    PATH_SANITIZERS = {'basename', 'os.path.basename', 'secure_filename'}

    @classmethod
    def is_type_coercion(cls, node: ast.AST) -> bool:
        """
        Checks if an AST expression is a primitive type cast (int(), float(), bool())
        which strips injection payloads.
        """
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in cls.TYPE_CAST_FUNCTIONS:
                return True
        return False

    @classmethod
    def is_command_sanitizer(cls, node: ast.AST) -> bool:
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in cls.COMMAND_SANITIZERS:
                return True
            if isinstance(node.func, ast.Attribute) and node.func.attr == 'quote':
                return True
        return False

    @classmethod
    def is_path_sanitizer(cls, node: ast.AST) -> bool:
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in cls.PATH_SANITIZERS:
                return True
            if isinstance(node.func, ast.Attribute) and node.func.attr in ('basename', 'secure_filename'):
                return True
        return False

    @classmethod
    def is_sql_parameterized(cls, call_node: ast.Call) -> Tuple[bool, Optional[str]]:
        """
        Checks if cursor.execute() uses safe parameterized queries (e.g. 2+ arguments where query is static/clean).
        Example: cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        """
        if len(call_node.args) >= 2:
            query_arg = call_node.args[0]
            # If the query string itself is a static constant or template string without BinOp/JoinedStr concatenation
            if isinstance(query_arg, ast.Constant) and isinstance(query_arg.value, str):
                return True, "Parameterized Query Arguments"
        return False, None
