CREATE TABLE [dbo].[BaoHanh] (
    [MaBH]        INT            IDENTITY (1, 1) NOT NULL,
    [MaHD]        INT            NULL,
    [NgayBatDau]  DATETIME       NULL,
    [NgayKetThuc] DATETIME       NULL,
    [MoTa]        NVARCHAR (200) NULL,
    PRIMARY KEY CLUSTERED ([MaBH] ASC),
    FOREIGN KEY ([MaHD]) REFERENCES [dbo].[HoaDon] ([MaHD])
);


GO

CREATE TABLE [dbo].[ChiTietHoaDon] (
    [MaCTHD]    INT             IDENTITY (1, 1) NOT NULL,
    [MaHD]      INT             NULL,
    [MaXe]      VARCHAR (10)    NULL,
    [SoLuong]   INT             NULL,
    [DonGia]    DECIMAL (18, 2) NULL,
    [ThanhTien] AS              ([SoLuong]*[DonGia]),
    PRIMARY KEY CLUSTERED ([MaCTHD] ASC),
    CONSTRAINT [CHK_DonGia_Min] CHECK ([DonGia]>(0)),
    CONSTRAINT [CHK_GiaThucTe] CHECK ([DonGia]>(0)),
    CONSTRAINT [CHK_SoLuong_Min] CHECK ([SoLuong]>(0)),
    CONSTRAINT [CHK_SoLuongBan] CHECK ([SoLuong]>(0)),
    FOREIGN KEY ([MaHD]) REFERENCES [dbo].[HoaDon] ([MaHD]),
    FOREIGN KEY ([MaXe]) REFERENCES [dbo].[OTo] ([MaXe])
);


GO

CREATE TABLE [dbo].[OTo] (
    [MaXe]       VARCHAR (10)    NOT NULL,
    [TenXe]      NVARCHAR (100)  NOT NULL,
    [HangXe]     NVARCHAR (50)   NULL,
    [NamSanXuat] INT             NULL,
    [GiaBan]     DECIMAL (18, 2) NULL,
    [SoLuongTon] INT             DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([MaXe] ASC),
    CONSTRAINT [CHK_GiaBan] CHECK ([GiaBan]>(0)),
    CONSTRAINT [CHK_GiaBan_Positive] CHECK ([GiaBan]>(0)),
    CONSTRAINT [CHK_NamSanXuat_Valid] CHECK ([NamSanXuat]>(1886)),
    CONSTRAINT [CHK_NamSX] CHECK ([NamSanXuat]>(1886)),
    CONSTRAINT [CHK_SoLuongTon] CHECK ([SoLuongTon]>=(0)),
    CONSTRAINT [CHK_SoLuongTon_NotNegative] CHECK ([SoLuongTon]>=(0))
);


GO

CREATE TABLE [dbo].[KhachHang] (
    [MaKH]        VARCHAR (10)   NOT NULL,
    [HoTen]       NVARCHAR (100) NOT NULL,
    [SoDienThoai] VARCHAR (15)   NULL,
    [DiaChi]      NVARCHAR (200) NULL,
    PRIMARY KEY CLUSTERED ([MaKH] ASC),
    CONSTRAINT [CHK_SĐT_HopLe] CHECK (len([SoDienThoai])>=(10)),
    CONSTRAINT [CHK_SĐT_Length] CHECK (len([SoDienThoai])>=(10)),
    CONSTRAINT [UQ_KhachHang_SoDienThoai] UNIQUE NONCLUSTERED ([SoDienThoai] ASC),
    CONSTRAINT [UQ_SĐT] UNIQUE NONCLUSTERED ([SoDienThoai] ASC)
);


GO

CREATE TABLE [dbo].[NhaCungCap] (
    [MaNCC]       VARCHAR (10)   NOT NULL,
    [TenNCC]      NVARCHAR (100) NOT NULL,
    [DiaChi]      NVARCHAR (200) NULL,
    [SoDienThoai] VARCHAR (15)   NULL,
    PRIMARY KEY CLUSTERED ([MaNCC] ASC)
);


GO

CREATE TABLE [dbo].[NhanVien] (
    [MaNV]   VARCHAR (10)   NOT NULL,
    [HoTen]  NVARCHAR (100) NOT NULL,
    [ChucVu] NVARCHAR (50)  NULL,
    PRIMARY KEY CLUSTERED ([MaNV] ASC)
);


GO

CREATE TABLE [dbo].[NhapHang] (
    [MaNhap]    INT             IDENTITY (1, 1) NOT NULL,
    [NgayNhap]  DATETIME        DEFAULT (getdate()) NULL,
    [MaNCC]     VARCHAR (10)    NULL,
    [MaXe]      VARCHAR (10)    NULL,
    [SoLuong]   INT             NULL,
    [DonGia]    DECIMAL (18, 2) NULL,
    [ThanhTien] AS              ([SoLuong]*[DonGia]),
    PRIMARY KEY CLUSTERED ([MaNhap] ASC),
    CONSTRAINT [CHK_NhapHang_GiaNhap] CHECK ([DonGia]>(0)),
    CONSTRAINT [CHK_NhapHang_SoLuong] CHECK ([SoLuong]>(0)),
    FOREIGN KEY ([MaNCC]) REFERENCES [dbo].[NhaCungCap] ([MaNCC]),
    FOREIGN KEY ([MaXe]) REFERENCES [dbo].[OTo] ([MaXe])
);


GO

CREATE TABLE [dbo].[HoaDon] (
    [MaHD]     INT             IDENTITY (1, 1) NOT NULL,
    [NgayBan]  DATETIME        DEFAULT (getdate()) NULL,
    [MaKH]     VARCHAR (10)    NULL,
    [MaNV]     VARCHAR (10)    NULL,
    [MaXe]     VARCHAR (10)    NULL,
    [TongTien] DECIMAL (18, 2) NULL,
    PRIMARY KEY CLUSTERED ([MaHD] ASC),
    FOREIGN KEY ([MaKH]) REFERENCES [dbo].[KhachHang] ([MaKH]),
    FOREIGN KEY ([MaNV]) REFERENCES [dbo].[NhanVien] ([MaNV]),
    FOREIGN KEY ([MaXe]) REFERENCES [dbo].[OTo] ([MaXe])
);


GO

CREATE VIEW TonKhoHienTai AS
SELECT 
    ot.MaXe,
    ot.TenXe,
    ot.HangXe,
    ot.NamSanXuat,
    ot.GiaBan,
    ot.SoLuongTon AS TonKhoHienTai,
    ISNULL(nhap.TongNhap, 0) AS TongDaNhap,
    ISNULL(bans.TongDaBan, 0) AS TongDaBan,
    ot.SoLuongTon + ISNULL(bans.TongDaBan, 0) AS TongNhapTheoLyThuyet
FROM OTo ot
LEFT JOIN (
    SELECT MaXe, SUM(SoLuong) AS TongNhap
    FROM NhapHang
    GROUP BY MaXe
) nhap ON ot.MaXe = nhap.MaXe
LEFT JOIN (
    SELECT MaXe, SUM(SoLuong) AS TongDaBan
    FROM ChiTietHoaDon
    GROUP BY MaXe
) bans ON ot.MaXe = bans.MaXe;

GO

CREATE VIEW vQuanLyNhanVien AS
SELECT 
    nv.MaNV,
    nv.HoTen,
    nv.ChucVu,
    COUNT(DISTINCT hd.MaHD) AS SoHoaDon,
    SUM(cthd.SoLuong) AS SoXeDaBan,
    SUM(hd.TongTien) AS DoanhThu,
    AVG(hd.TongTien) AS DoanhThuTrungBinh,
    COUNT(DISTINCT hd.MaKH) AS SoKhachHangPhucVu,
    MIN(hd.NgayBan) AS NgayBanDauTien,
    MAX(hd.NgayBan) AS NgayBanGanNhat
FROM NhanVien nv
LEFT JOIN HoaDon hd ON nv.MaNV = hd.MaNV
LEFT JOIN ChiTietHoaDon cthd ON hd.MaHD = cthd.MaHD
GROUP BY nv.MaNV, nv.HoTen, nv.ChucVu;

GO

CREATE VIEW ThongTinBaoHanh AS
SELECT 
    bh.MaBH,
    hd.MaHD,
    hd.NgayBan,
    kh.HoTen AS TenKhachHang,
    kh.SoDienThoai,
    ot.TenXe,
    ot.HangXe,
    bh.NgayBatDau,
    bh.NgayKetThuc,
    bh.MoTa,
    DATEDIFF(DAY, GETDATE(), bh.NgayKetThuc) AS SoNgayConBaoHanh,
    CASE 
        WHEN GETDATE() BETWEEN bh.NgayBatDau AND bh.NgayKetThuc THEN N'Còn hiệu lực'
        WHEN GETDATE() > bh.NgayKetThuc THEN N'Hết hạn'
        ELSE N'Chưa kích hoạt'
    END AS TrangThaiBaoHanh
FROM BaoHanh bh
JOIN HoaDon hd ON bh.MaHD = hd.MaHD
JOIN KhachHang kh ON hd.MaKH = kh.MaKH
JOIN ChiTietHoaDon cthd ON hd.MaHD = cthd.MaHD
JOIN OTo ot ON cthd.MaXe = ot.MaXe;

GO


CREATE VIEW vw_DoanhThuTheoXe AS
SELECT 
    O.TenXe,
    O.HangXe,
    SUM(ISNULL(CT.SoLuong, 0)) AS TongSoLuongBan,
    SUM(ISNULL(CT.ThanhTien, 0)) AS TongDoanhThu,
    O.SoLuongTon
FROM OTo O
LEFT JOIN ChiTietHoaDon CT ON O.MaXe = CT.MaXe
GROUP BY O.TenXe, O.HangXe, O.SoLuongTon;

GO


CREATE VIEW vw_HieuSuatNhanVien AS
SELECT 
    N.HoTen AS TenNhanVien,
    COUNT(H.MaHD) AS SoHoaDonDaLap,
    SUM(ISNULL(H.TongTien, 0)) AS DoanhSoCaNhan
FROM NhanVien N
LEFT JOIN HoaDon H ON N.MaNV = H.MaNV
GROUP BY N.HoTen;

GO

CREATE VIEW DoanhThuTheoThang AS
SELECT 
    YEAR(NgayBan) AS Nam,
    MONTH(NgayBan) AS Thang,
    COUNT(DISTINCT MaHD) AS SoLuongHoaDon,
    SUM(TongTien) AS DoanhThu,
    AVG(TongTien) AS DoanhThuTrungBinh
FROM HoaDon
GROUP BY YEAR(NgayBan), MONTH(NgayBan);

GO

CREATE VIEW ChiTietHoaDonBanHang AS
SELECT 
    hd.MaHD,
    hd.NgayBan,
    kh.MaKH,
    kh.HoTen AS TenKhachHang,
    kh.SoDienThoai,
    nv.MaNV,
    nv.HoTen AS TenNhanVien,
    ot.MaXe,
    ot.TenXe,
    ot.HangXe,
    cthd.SoLuong,
    cthd.DonGia,
    cthd.ThanhTien,
    hd.TongTien
FROM HoaDon hd
JOIN KhachHang kh ON hd.MaKH = kh.MaKH
JOIN NhanVien nv ON hd.MaNV = nv.MaNV
JOIN ChiTietHoaDon cthd ON hd.MaHD = cthd.MaHD
JOIN OTo ot ON cthd.MaXe = ot.MaXe;

GO

CREATE VIEW ChiTietNhapHang AS
SELECT 
    nh.MaNhap,
    nh.NgayNhap,
    ncc.MaNCC,
    ncc.TenNCC,
    ot.MaXe,
    ot.TenXe,
    ot.HangXe,
    nh.SoLuong,
    nh.DonGia,
    nh.ThanhTien
FROM NhapHang nh
JOIN NhaCungCap ncc ON nh.MaNCC = ncc.MaNCC
JOIN OTo ot ON nh.MaXe = ot.MaXe;

GO

CREATE VIEW DoanhThuTheoNgay AS
SELECT 
    CAST(NgayBan AS DATE) AS Ngay,
    COUNT(DISTINCT MaHD) AS SoLuongHoaDon,
    SUM(TongTien) AS DoanhThu,
    COUNT(DISTINCT MaKH) AS SoKhachHang
FROM HoaDon
GROUP BY CAST(NgayBan AS DATE);

GO


CREATE PROCEDURE sp_BanXeMoi
    @MaKH VARCHAR(10),
    @MaNV VARCHAR(10),
    @MaXe VARCHAR(10),
    @SoLuong INT,
    @DonGia DECIMAL(18,2)
AS
BEGIN
    -- 1. Chèn vào bảng HoaDon
    INSERT INTO HoaDon (MaKH, MaNV, MaXe, TongTien) 
    VALUES (@MaKH, @MaNV, @MaXe, @SoLuong * @DonGia);
    
    -- 2. Lấy ID hóa đơn vừa tự sinh ra
    DECLARE @MaHD_VuaTao INT = SCOPE_IDENTITY();
    
    -- 3. Chèn vào bảng ChiTietHoaDon (Trigger sẽ tự động trừ kho ở bước này)
    INSERT INTO ChiTietHoaDon (MaHD, MaXe, SoLuong, DonGia) 
    VALUES (@MaHD_VuaTao, @MaXe, @SoLuong, @DonGia);
    
    PRINT N'Giao dịch thành công! Mã hóa đơn mới: ' + CAST(@MaHD_VuaTao AS VARCHAR);
END;

GO


CREATE PROCEDURE sp_NhapHang
    @MaNCC VARCHAR(10),
    @MaXe VARCHAR(10),
    @SoLuong INT,
    @DonGia DECIMAL(18,2)
AS
BEGIN
    INSERT INTO NhapHang (MaNCC, MaXe, SoLuong, DonGia)
    VALUES (@MaNCC, @MaXe, @SoLuong, @DonGia);
    
    PRINT N'Đã nhập hàng thành công. Kho đã tự động cộng số lượng.';
END;

GO


CREATE PROCEDURE sp_CapNhatGiaXe
    @MaXe VARCHAR(10),
    @GiaMoi DECIMAL(18,2)
AS
BEGIN
    IF (@GiaMoi <= 0)
    BEGIN
        PRINT N'Lỗi: Giá mới phải lớn hơn 0!';
        RETURN;
    END

    UPDATE OTo SET GiaBan = @GiaMoi WHERE MaXe = @MaXe;
    PRINT N'Cập nhật giá xe ' + @MaXe + N' thành công.';
END;

GO


CREATE TRIGGER TRG_TruKho_KhiBan
ON ChiTietHoaDon
AFTER INSERT
AS
BEGIN
    -- Cập nhật bảng OTo bằng cách trừ đi số lượng trong bảng inserted (dữ liệu vừa chèn)
    UPDATE OTo
    SET SoLuongTon = OTo.SoLuongTon - i.SoLuong
    FROM OTo
    INNER JOIN inserted i ON OTo.MaXe = i.MaXe;
    
    PRINT N'Đã tự động trừ số lượng trong kho hàng.';
END;

GO

CREATE TRIGGER CongKho_KhiNhap
ON NhapHang
AFTER INSERT
AS
BEGIN
    UPDATE OTo
    SET SoLuongTon = OTo.SoLuongTon + i.SoLuong
    FROM OTo
    INNER JOIN inserted i ON OTo.MaXe = i.MaXe;
    
    PRINT N'Đã tự động cộng thêm số lượng vào kho hàng.';
END;

GO

CREATE TRIGGER KiemTraTonKho
ON ChiTietHoaDon
FOR INSERT
AS
BEGIN
    -- Kiểm tra nếu số lượng bán lớn hơn số lượng hiện có trong kho
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN OTo o ON i.MaXe = o.MaXe
        WHERE o.SoLuongTon < i.SoLuong
    )
    BEGIN
        PRINT N'LỖI: Số lượng xe trong kho không đủ để bán!';
        ROLLBACK TRANSACTION; -- Hủy bỏ thao tác chèn dữ liệu
    END
END;

GO

GRANT VIEW ANY COLUMN MASTER KEY DEFINITION TO PUBLIC;


GO

GRANT VIEW ANY COLUMN ENCRYPTION KEY DEFINITION TO PUBLIC;


GO

