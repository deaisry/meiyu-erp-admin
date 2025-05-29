export default defineEventHandler(() => {
  return `
<h1>Meiyu ERP</h1>
<h2>Mock service is starting</h2>
<ul>
<li><a href="/api/user">/api/user/info</a></li>
<li><a href="/api/menu">/api/menu/all</a></li>
<li><a href="/api/auth/codes">/api/auth/codes</a></li>
<li><a href="/api/userBasicInfo/login">/api/userBasicInfo/login</a></li>
<li><a href="/api/upload">/api/upload</a></li>
</ul>
`;
});
