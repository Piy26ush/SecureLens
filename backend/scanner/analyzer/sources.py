import ast
from typing import Optional, Tuple

class SourceRegistry:
    """
    Identifies untrusted sources of user input in Python AST nodes.
    Supports Flask, Django, FastAPI, sys.argv, input(), and environment variables.
    """

    UNTRUSTED_REQUEST_ATTRS = {
        'args', 'form', 'values', 'json', 'data', 'headers', 
        'cookies', 'files', 'GET', 'POST', 'query_params', 'query'
    }

    @classmethod
    def is_untrusted_source(cls, node: ast.AST) -> Tuple[bool, Optional[str]]:
        """
        Evaluates an AST node to determine if it represents an untrusted data source.
        Returns: (is_untrusted: bool, source_description: Optional[str])
        """
        # 1. input() call
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id == 'input':
                return True, "input()"
            
            # request.get_json(), request.json.get()
            if isinstance(node.func, ast.Attribute):
                caller = node.func.value
                attr = node.func.attr
                # request.get_json(...)
                if isinstance(caller, ast.Name) and caller.id == 'request' and attr in ('get_json', 'json'):
                    return True, f"request.{attr}()"
                # request.args.get(...), request.form.get(...), request.GET.get(...)
                if isinstance(caller, ast.Attribute) and isinstance(caller.value, ast.Name) and caller.value.id == 'request':
                    if caller.attr in cls.UNTRUSTED_REQUEST_ATTRS:
                        return True, ast.unparse(node)
                # os.getenv(...)
                if isinstance(caller, ast.Name) and caller.id == 'os' and attr in ('getenv',):
                    return True, ast.unparse(node)
                # os.environ.get(...)
                if isinstance(caller, ast.Attribute) and isinstance(caller.value, ast.Name) and caller.value.id == 'os' and caller.attr == 'environ':
                    return True, ast.unparse(node)

        # 2. Subscript access: request.args['id'], request.form['key'], sys.argv[1], os.environ['VAR']
        if isinstance(node, ast.Subscript):
            target = node.value
            # request.args['id']
            if isinstance(target, ast.Attribute) and isinstance(target.value, ast.Name) and target.value.id == 'request':
                if target.attr in cls.UNTRUSTED_REQUEST_ATTRS:
                    return True, ast.unparse(node)
            # sys.argv[1]
            if isinstance(target, ast.Attribute) and isinstance(target.value, ast.Name) and target.value.id == 'sys' and target.attr == 'argv':
                return True, ast.unparse(node)
            # os.environ['VAR']
            if isinstance(target, ast.Attribute) and isinstance(target.value, ast.Name) and target.value.id == 'os' and target.attr == 'environ':
                return True, ast.unparse(node)

        # 3. Direct attribute access: request.args, request.data, sys.argv
        if isinstance(node, ast.Attribute):
            if isinstance(node.value, ast.Name):
                if node.value.id == 'request' and node.attr in cls.UNTRUSTED_REQUEST_ATTRS:
                    return True, f"request.{node.attr}"
                if node.value.id == 'sys' and node.attr == 'argv':
                    return True, "sys.argv"
                if node.value.id == 'os' and node.attr == 'environ':
                    return True, "os.environ"

        return False, None
